import { Reducer } from "redux"
import { CustomAction, CustomActionCreator, CustomThunkActionCreator } from "../../types/reduxTypes"
import { IProject } from "../../types/types"
import { apiService } from "../../services/apiService"

type CurrentProjectName = string
type LoadingState = boolean
type LoadError = string

interface IProjectWithCount extends IProject {
	taskCount: number
}

interface ProjectState {
	isLoading: LoadingState
	loadError: LoadError
	list: IProjectWithCount[]
	current: CurrentProjectName
}

type Actions = CustomAction<CurrentProjectName> | CustomAction<IProject[]> | CustomAction<LoadingState>

const initialState: ProjectState = {
	isLoading: false,
	loadError: '',
	list: [],
	current: ''
}

const SET_PROJECTS_LOADING = 'SET_PROJECTS_LOADING'
const SET_PROJECTS_ERROR = 'SET_PROJECTS_ERROR'
const UPDATE_PROJECTS = 'UPDATE_PROJECTS'
const UPDATE_CURRENT_PROJECT = 'UPDATE_CURRENT_PROJECT'

export const projectReducer: Reducer<ProjectState, Actions> = (state = initialState, action) => {
	switch(action.type) {
		case SET_PROJECTS_LOADING:
			return {...state, isLoading: action.payload as LoadingState}
		case SET_PROJECTS_ERROR:
			return {...state, loadError: action.payload as LoadError}
		case UPDATE_PROJECTS:
			return {...state, list: action.payload as IProjectWithCount[]}
		case UPDATE_CURRENT_PROJECT:
			return {...state, current: action.payload as CurrentProjectName}
		default:
			return state
	}
}

// export const setActiveProject: CustomActionCreator<CurrentProjectName> = (payload) => ({type: UPDATE_CURRENT_PROJECT, payload})

export const updateProjectList = (): CustomThunkActionCreator<IProject[] | LoadingState | LoadError> => async (dispatch) => {
	dispatch({type: SET_PROJECTS_LOADING, payload: true})
	dispatch({type: SET_PROJECTS_ERROR, payload: ''})

	let projects = await apiService.projects.get()
	if (projects.error) dispatch({type: SET_PROJECTS_ERROR, payload: projects.error.message})
	else {
		let tasks = await apiService.tasks.getAll(null)
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
