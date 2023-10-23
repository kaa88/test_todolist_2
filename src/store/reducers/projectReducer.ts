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
interface ProjectWithCountPayload {
	projectId: Id
	increment?: boolean
	decrement?: boolean
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
	| CustomAction<IProjectWithCount>
	| CustomAction<IProjectWithCount[]>
	| CustomAction<ProjectWithCountPayload>

const initialState: ProjectState = {
	isLoading: false,
	loadError: '',
	list: [],
	current: null
}

const SET_PROJECTS_LOADING = 'SET_PROJECTS_LOADING'
const SET_PROJECTS_ERROR = 'SET_PROJECTS_ERROR'
const SET_PROJECT_LIST = 'SET_PROJECT_LIST'
const SET_CURRENT_PROJECT = 'SET_CURRENT_PROJECT'
const CREATE_PROJECT = 'CREATE_PROJECT'
const DELETE_PROJECT = 'DELETE_PROJECT'
const UPDATE_PROJECT = 'UPDATE_PROJECT'
const UPDATE_PROJECT_TASK_COUNT = 'UPDATE_PROJECT_TASK_COUNT'

export const projectReducer: Reducer<ProjectState, Actions> = (state = initialState, action) => {
	let newList: IProjectWithCount[] | null, index: number
	switch(action.type) {
		case SET_PROJECTS_LOADING:
			return {...state, isLoading: action.payload as LoadingState}

		case SET_PROJECTS_ERROR:
			return {...state, loadError: action.payload as LoadError}

		case SET_PROJECT_LIST:
			return {...state, list: action.payload as IProjectWithCount[]}

		case SET_CURRENT_PROJECT:
			return {...state, current: action.payload as CurrentProject}

		case CREATE_PROJECT:
			const createdProject = action.payload as IProjectWithCount
			newList = [...state.list]
			newList.push(createdProject)
			return {...state, list: newList}

		case DELETE_PROJECT:
			const deletedProject = action.payload as IProjectWithCount
			newList = state.list.filter(item => item.id !== deletedProject.id)
			ApiService.projects.delete(deletedProject.id)
			return {...state, list: newList}

		case UPDATE_PROJECT:
			const updatedProject = action.payload as IProjectWithCount
			index = state.list.findIndex(p => p.id === updatedProject.id)
			if (index < 0) return state
			newList = [...state.list]
			newList[index] = updatedProject
			ApiService.projects.edit(updatedProject)
			return {...state, list: newList}

		case UPDATE_PROJECT_TASK_COUNT:
			const payload = action.payload as ProjectWithCountPayload
			index = state.list.findIndex(p => p.id === payload.projectId)
			if (index < 0) return state
			newList = [...state.list]
			let count = newList[index].taskCount || 0
			if (payload.increment) count += 1
			if (payload.decrement) count = count > 0 ? count - 1 : count
			if (newList[index].taskCount !== count) {
				newList[index].taskCount = count
				ApiService.projects.edit(newList[index])
				return {...state, list: newList}
			}
			else return state

		default:
			return state
	}
}

// Action Creators
export const setCurrentProject: CustomActionCreator<CurrentProject> = (payload) => ({type: SET_CURRENT_PROJECT, payload})
export const updateProject: CustomActionCreator<IProjectWithCount> = (payload) => ({type: UPDATE_PROJECT, payload})
export const deleteProject: CustomActionCreator<IProjectWithCount> = (payload) => ({type: DELETE_PROJECT, payload})
export const updateProjectTaskCount: CustomActionCreator<ProjectWithCountPayload> = (payload) => ({type: UPDATE_PROJECT_TASK_COUNT, payload})

// Thunk Action Creators
export const createNewProject = (name: IProject['name']): CustomThunkActionCreator<IProjectWithCount | LoadingState | LoadError> => async (dispatch) => {
	dispatch({type: SET_PROJECTS_LOADING, payload: true})
	dispatch({type: SET_PROJECTS_ERROR, payload: ''})

	const newProject = {
		id: 0,
		name: name || 'New Project',
	}
	let response = await ApiService.projects.add(newProject)
	if (response.error) dispatch({type: SET_PROJECTS_ERROR, payload: response.error.message})
	else if (response.data) {
		let projectWithCount: IProjectWithCount = {...response.data[0], taskCount: 0}
		dispatch({type: CREATE_PROJECT, payload: projectWithCount})
	}

	dispatch({type: SET_PROJECTS_LOADING, payload: false})
}

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
			dispatch({type: SET_PROJECT_LIST, payload: projectsWithCount})
		}
	}

	dispatch({type: SET_PROJECTS_LOADING, payload: false})
}
