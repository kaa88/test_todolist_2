import { Reducer } from "redux"
import { CustomAction, CustomActionCreator, CustomThunkActionCreator } from "../../types/reduxTypes"
import { IUserSettings, TaskSort, TaskStatus } from "../../types/types"
import { ApiService } from "../../services/ApiService"

type LoadingState = boolean
type LoadError = string
type UserState = IUserSettings

type Actions = 
	  CustomAction<LoadingState>
	| CustomAction<LoadError>
	| CustomAction<UserState>

const initialState: UserState = {
	id: 0,
	showSubtasks: false,
	sortBy: TaskSort.id,
	taskGroupAscendingOrder: {
		[TaskStatus.queue]: false,
		[TaskStatus.dev]: false,
		[TaskStatus.done]: false,
	}
}

const SET_SETTINGS_LOADING = 'SET_SETTINGS_LOADING'
const SET_SETTINGS_ERROR = 'SET_SETTINGS_ERROR'
const GET_SETTINGS = 'GET_SETTINGS'
const UPDATE_SETTINGS = 'UPDATE_SETTINGS'

export const userReducer: Reducer<UserState, Actions> = (state = initialState, action) => {
	let settings: UserState
	switch(action.type) {
		case SET_SETTINGS_LOADING:
			return {...state, isLoading: action.payload as LoadingState}
		case SET_SETTINGS_ERROR:
			return {...state, loadError: action.payload as LoadError}
		case GET_SETTINGS:
			settings = action.payload as UserState
			return {...state, ...settings}
		case UPDATE_SETTINGS:
			settings = action.payload as UserState
			ApiService.settings.edit(settings)
			return {...state, ...settings}
		default:
			return state
	}
}

export const updateSettings: CustomActionCreator<UserState> = (payload) => ({type: UPDATE_SETTINGS, payload})

export const getSettings = (): CustomThunkActionCreator<UserState | LoadingState | LoadError> => async (dispatch) => {
	dispatch({type: SET_SETTINGS_LOADING, payload: true})
	dispatch({type: SET_SETTINGS_ERROR, payload: ''})

	const userId = 0
	let response = await ApiService.settings.get(userId)
	if (response.error) dispatch({type: SET_SETTINGS_ERROR, payload: response.error.message})
	else if (response.data) dispatch({type: GET_SETTINGS, payload: response.data[userId]})

	dispatch({type: SET_SETTINGS_LOADING, payload: false})
}
