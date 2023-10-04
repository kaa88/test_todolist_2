import { Reducer } from "redux"
import { CustomAction, CustomActionCreator, CustomThunkActionCreator } from "../../types/reduxTypes"
import { IProject } from "../../types/types"
import { projectService } from "../../services/projectService"

type CurrentProjectName = string
type LoadingState = boolean
type LoadError = string

interface ProjectState {
	isLoading: LoadingState
	loadError: LoadError
	list: IProject[]
	current: CurrentProjectName
}

type Actions = CustomAction<CurrentProjectName> | CustomAction<IProject[]> | CustomAction<LoadingState>

const initialState: ProjectState = {
	isLoading: false,
	loadError: '',
	list: [],
	current: ''
}

const SET_LOADING = 'SET_LOADING'
const SET_LOAD_ERROR = 'SET_LOAD_ERROR'
const UPDATE_PROJECTS = 'UPDATE_PROJECTS'
const SET_CURRENT_PROJECT = 'SET_CURRENT_PROJECT'

export const projectReducer: Reducer<ProjectState, Actions> = (state = initialState, action) => {
	switch(action.type) {
		case SET_LOADING:
			return {...state, isLoading: action.payload as LoadingState}
		case SET_LOAD_ERROR:
			return {...state, loadError: action.payload as LoadError}
		case UPDATE_PROJECTS:
			return {...state, list: action.payload as IProject[]}
		case SET_CURRENT_PROJECT:
			return {...state, current: action.payload as CurrentProjectName}
		default:
			return state
	}
}

export const setActiveProject: CustomActionCreator<CurrentProjectName> = (payload) => ({type: SET_CURRENT_PROJECT, payload})

export const updateProjectList = (): CustomThunkActionCreator<IProject[] | LoadingState | LoadError> => async (dispatch) => {
	dispatch({type: SET_LOADING, payload: true})
	dispatch({type: SET_LOAD_ERROR, payload: ''})
	let payload = await projectService.getProjects()
	if (payload instanceof Error) dispatch({type: SET_LOAD_ERROR, payload: payload.message})
	else dispatch({type: UPDATE_PROJECTS, payload})
	dispatch({type: SET_LOADING, payload: false})
}
