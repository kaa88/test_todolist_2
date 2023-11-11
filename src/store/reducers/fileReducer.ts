import { Reducer } from "redux"
import { CustomAction, CustomActionCreator, CustomThunkActionCreator } from "../../types/reduxTypes"
import { Id, IFile, IServerFile } from "../../types/types"
import { ApiService } from "../../services/ApiService"
import { updateFileCount, CountPayload } from "./taskReducer"
import { AxiosError } from "axios"

const DEFAULT_ERROR = 'Unknown error'

type LoadingState = boolean
type LoadError = string

interface FileState {
	isLoading: LoadingState
	loadError: LoadError
	list: IFile[]
	prevTaskId: Id | null
}

type Actions =
	  CustomAction<LoadingState>
	| CustomAction<LoadError>
	| CustomAction<IFile>
	| CustomAction<IFile[]>
	| CustomAction<Id>

const initialState: FileState = {
	isLoading: false,
	loadError: '',
	list: [],
	prevTaskId: null
}

const SET_FILES_LOADING = 'SET_FILES_LOADING'
const SET_FILES_ERROR = 'SET_FILES_ERROR'
const UPDATE_ALL_FILES = 'UPDATE_ALL_FILES'
const ADD_FILE = 'ADD_FILE'
const DELETE_FILE = 'DELETE_FILE'
const CLEAR_FILE_LIST = 'CLEAR_FILE_LIST'
const RESTORE_PREV_FILE_LIST = 'RESTORE_PREV_FILE_LIST'

export const fileReducer: Reducer<FileState, Actions> = (state = initialState, action) => {
	let newList: IFile[]
	switch(action.type) {
		case SET_FILES_LOADING:
			return {...state, isLoading: action.payload as LoadingState}

		case SET_FILES_ERROR:
			return {...state, loadError: action.payload as LoadError}

		case UPDATE_ALL_FILES:
			return {...state, list: action.payload as IFile[]}

		case CLEAR_FILE_LIST:
			return {...state, list: initialState.list}

		case RESTORE_PREV_FILE_LIST:
			const taskId = action.payload as Id
			if (taskId !== state.prevTaskId)
				return {...state, list: initialState.list, prevTaskId: taskId}
			else return state

		case ADD_FILE:
			const newFile = action.payload as IFile
			newList = [...state.list]
			newList.push(newFile)
			return {...state, list: newList}

		case DELETE_FILE:
			const deletedFile = action.payload as IFile
			newList = state.list.filter(item => item.id !== deletedFile.id)
			ApiService.files.delete(deletedFile.id)
			return {...state, list: newList}

		default:
			return state
	}
}

export const clearFileList: CustomActionCreator = () => ({type: CLEAR_FILE_LIST, payload: null})

export const createFile = (newFile: IFile): CustomThunkActionCreator<IFile[] | LoadingState | LoadError | CountPayload> => async (dispatch) => {
	dispatch({type: SET_FILES_LOADING, payload: true})
	dispatch({type: SET_FILES_ERROR, payload: ''})

	let response = await ApiService.files.add(getServerFile(newFile))
	if (response instanceof AxiosError) {
		let message = response.response?.data.message || DEFAULT_ERROR
		dispatch({type: SET_FILES_ERROR, payload: message})
	}
	else if (response.data) {
		dispatch({type: ADD_FILE, payload: response.data})
		dispatch(updateFileCount({taskId: response.data.taskId, increment: true}))
	}
	dispatch({type: SET_FILES_LOADING, payload: false})
}
export const updateFileList = (taskId: Id): CustomThunkActionCreator<IFile[] | LoadingState | LoadError | Id> => async (dispatch) => {
	dispatch({type: SET_FILES_LOADING, payload: true})
	dispatch({type: SET_FILES_ERROR, payload: ''})
	dispatch({type: RESTORE_PREV_FILE_LIST, payload: taskId})

	let response = await ApiService.files.get(taskId)
	if (response instanceof AxiosError) {
		let message = response.response?.data.message || DEFAULT_ERROR
		dispatch({type: SET_FILES_ERROR, payload: message})
	}
	else if (response.data) {
		let correctFile = response.data.map(item => getClientFile(item))
		dispatch({type: UPDATE_ALL_FILES, payload: correctFile})
	}

	dispatch({type: SET_FILES_LOADING, payload: false})
}

const getClientFile = (file: IServerFile) => {
	return {...file, date: new Date(file.date).getTime()}
}
const getServerFile = (file: IFile) => {
	return {...file, date: new Date(file.date)}
}
