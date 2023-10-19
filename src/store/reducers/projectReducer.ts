import { Reducer } from "redux"
import { CustomAction, CustomActionCreator, CustomThunkActionCreator } from "../../types/reduxTypes"
import { IProject, Id } from "../../types/types"
import { ApiService } from "../../services/ApiService"

type CurrentProject = Id | null
type LoadingState = boolean
type LoadError = string

interface IProjectWithCount extends IProject {
	taskCount: number
}

interface ProjectState {
	isLoading: LoadingState
	loadError: LoadError
	list: IProjectWithCount[]
	current: CurrentProject
}

type Actions =
	  CustomAction<LoadingState>
	| CustomAction<LoadError>
	| CustomAction<CurrentProject>
	| CustomAction<IProjectWithCount[]>

const initialState: ProjectState = {
	isLoading: false,
	loadError: '',
	list: [],
	current: null
}

const SET_PROJECTS_LOADING = 'SET_PROJECTS_LOADING'
const SET_PROJECTS_ERROR = 'SET_PROJECTS_ERROR'
const UPDATE_PROJECTS = 'UPDATE_PROJECTS'
const SET_CURRENT_PROJECT = 'SET_CURRENT_PROJECT'

export const projectReducer: Reducer<ProjectState, Actions> = (state = initialState, action) => {
	switch(action.type) {
		case SET_PROJECTS_LOADING:
			return {...state, isLoading: action.payload as LoadingState}
		case SET_PROJECTS_ERROR:
			return {...state, loadError: action.payload as LoadError}
		case UPDATE_PROJECTS:
			return {...state, list: action.payload as IProjectWithCount[]}
		case SET_CURRENT_PROJECT:
			return {...state, current: action.payload as CurrentProject}
		default:
			return state
	}
}

export const setCurrentProject: CustomActionCreator<CurrentProject> = (payload) => ({type: SET_CURRENT_PROJECT, payload})

export const updateProjectList = (): CustomThunkActionCreator<IProject[] | LoadingState | LoadError> => async (dispatch) => {
	dispatch({type: SET_PROJECTS_LOADING, payload: true})
	dispatch({type: SET_PROJECTS_ERROR, payload: ''})

	let projects = await ApiService.projects.get()
	if (projects.error) dispatch({type: SET_PROJECTS_ERROR, payload: projects.error.message})
	else {
		let tasks = await ApiService.tasks.getAll(null)
		if (projects.data) {
			let projectsWithCount = projects.data.map(proj => {
				let taskCount = tasks.data ? tasks.data.reduce((count, task) => task.projectId === proj.id ? count + 1 : count, 0) : 0
				return {...proj, taskCount}
			})
			dispatch({type: UPDATE_PROJECTS, payload: projectsWithCount})
		}
	}

	dispatch({type: SET_PROJECTS_LOADING, payload: false})
}
