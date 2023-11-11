import { Reducer } from "redux"
import { CustomAction, CustomActionCreator, CustomThunkActionCreator } from "../../types/reduxTypes"
import { IUserServerSettings, IUserClientSettings, Id, TaskSort, TaskStatus } from "../../types/types"
import { ApiService } from "../../services/ApiService"
import { AxiosError } from "axios"

const DEFAULT_ERROR = 'Unknown error'

type LoadingState = boolean
type LoadError = string

interface UserState extends IUserClientSettings {
	isLoading?: LoadingState,
	loadError?: LoadError,
}

type Actions =
	  CustomAction<LoadingState>
	| CustomAction<LoadError>
	| CustomAction<IUserClientSettings>
	| CustomAction<IUserServerSettings>

const initialState: UserState = {
	isLoading: true,
	loadError: '',
	id: null,
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
	let clientSettings: IUserClientSettings, serverSettings: IUserServerSettings
	switch(action.type) {
		case SET_SETTINGS_LOADING:
			return {...state, isLoading: action.payload as LoadingState}
		case SET_SETTINGS_ERROR:
			return {...state, loadError: action.payload as LoadError}
		case GET_SETTINGS:
			serverSettings = action.payload as IUserServerSettings
			clientSettings = new ClientSettings(serverSettings)
			return clientSettings
		case UPDATE_SETTINGS:
			clientSettings = action.payload as IUserClientSettings
			serverSettings = new ServerSettings(clientSettings)
			ApiService.user.edit(serverSettings)
			return clientSettings
		default:
			return state
	}
}

export const updateSettings: CustomActionCreator<IUserClientSettings> = (payload) => ({type: UPDATE_SETTINGS, payload})

export const getSettings = (): CustomThunkActionCreator<IUserServerSettings | LoadingState | LoadError> => async (dispatch) => {
	dispatch({type: SET_SETTINGS_LOADING, payload: true})
	dispatch({type: SET_SETTINGS_ERROR, payload: ''})

	const createUser = async () => {
		let newUserResponse = await ApiService.user.add()
		if (newUserResponse instanceof AxiosError) {
			let message = newUserResponse.response?.data.message || DEFAULT_ERROR
			dispatch({type: SET_SETTINGS_ERROR, payload: message})
		}
		else if (newUserResponse.data) {
			dispatch({type: GET_SETTINGS, payload: newUserResponse.data})
			localStorage.setItem('userId', newUserResponse.data.id.toString())
		}
	}

	const userIdStorageValue = localStorage.getItem('userId')
	if (userIdStorageValue) {
		let userId: Id = Number(userIdStorageValue)
		let response = await ApiService.user.get(userId)
		if (response instanceof AxiosError) {
			let message = response.response?.data.message || DEFAULT_ERROR
			dispatch({type: SET_SETTINGS_ERROR, payload: message})
		}
		else {
			let user = response.data.find(item => item.id === userId)
			if (user) dispatch({type: GET_SETTINGS, payload: user})
			else await createUser()
		}
	}
	else await createUser()

	dispatch({type: SET_SETTINGS_LOADING, payload: false})
}


class ClientSettings extends IUserClientSettings {
	constructor(serverSettings: IUserServerSettings) {
		super()
		this.id = serverSettings.id
		this.showSubtasks = serverSettings.showSubtasks
		this.sortBy = serverSettings.sortBy
		this.taskGroupAscendingOrder = {
			[TaskStatus.queue]: serverSettings.queueAscendingOrder,
			[TaskStatus.dev]: serverSettings.devAscendingOrder,
			[TaskStatus.done]: serverSettings.doneAscendingOrder,
		}
	}
}
class ServerSettings extends IUserServerSettings {
	constructor(clientSettings: IUserClientSettings) {
		if (clientSettings.id === null) return;
		super()
		this.id = clientSettings.id
		this.showSubtasks = clientSettings.showSubtasks
		this.sortBy = clientSettings.sortBy
		this.queueAscendingOrder = clientSettings.taskGroupAscendingOrder[TaskStatus.queue]
		this.devAscendingOrder = clientSettings.taskGroupAscendingOrder[TaskStatus.dev]
		this.doneAscendingOrder = clientSettings.taskGroupAscendingOrder[TaskStatus.done]
	}
}
