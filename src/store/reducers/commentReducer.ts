import { Reducer } from "redux"
import { CustomAction, CustomActionCreator, CustomThunkActionCreator } from "../../types/reduxTypes"
import { Id, IComment, IServerComment } from "../../types/types"
import { ApiService } from "../../services/ApiService"
import { updateCommentCount, CountPayload } from "./taskReducer"
import { AxiosError } from "axios"

const DEFAULT_ERROR = 'Unknown error'

type LoadingState = boolean
type LoadError = string

interface CommentState {
	isLoading: LoadingState
	loadError: LoadError
	list: IComment[]
	prevTaskId: Id | null
}

type Actions =
	  CustomAction<LoadingState>
	| CustomAction<LoadError>
	| CustomAction<IComment>
	| CustomAction<IComment[]>
	| CustomAction<Id>

const initialState: CommentState = {
	isLoading: false,
	loadError: '',
	list: [],
	prevTaskId: null
}

const SET_COMMENTS_LOADING = 'SET_COMMENTS_LOADING'
const SET_COMMENTS_ERROR = 'SET_COMMENTS_ERROR'
const UPDATE_ALL_COMMENTS = 'UPDATE_ALL_COMMENTS'
const UPDATE_COMMENT = 'UPDATE_COMMENT'
const ADD_COMMENT = 'ADD_COMMENT'
const CLEAR_COMMENT_LIST = 'CLEAR_COMMENT_LIST'
const RESTORE_PREV_COMMENT_LIST = 'RESTORE_PREV_COMMENT_LIST'

export const commentReducer: Reducer<CommentState, Actions> = (state = initialState, action) => {
	let comment: IComment, index: number, newList: IComment[]
	switch(action.type) {
		case SET_COMMENTS_LOADING:
			return {...state, isLoading: action.payload as LoadingState}

		case SET_COMMENTS_ERROR:
			return {...state, loadError: action.payload as LoadError}

		case UPDATE_ALL_COMMENTS:
			return {...state, list: action.payload as IComment[]}

		case CLEAR_COMMENT_LIST:
			return {...state, list: initialState.list}

		case RESTORE_PREV_COMMENT_LIST:
			const taskId = action.payload as Id
			if (taskId !== state.prevTaskId)
				return {...state, list: initialState.list, prevTaskId: taskId}
			else return state

		case UPDATE_COMMENT:
			comment = action.payload as IComment
			index = state.list.findIndex(c => c.id === comment.id)
			if (index < 0) return state
			newList = [...state.list]
			newList[index] = comment
			ApiService.comments.edit(getServerComment(comment))
			return {...state, list: newList}

		case ADD_COMMENT:
			const newComment = action.payload as IComment
			newList = [...state.list]
			newList.push(newComment)
			return {...state, list: newList}
			
		default:
			return state
	}
}

export const clearCommentList: CustomActionCreator = () => ({type: CLEAR_COMMENT_LIST, payload: null})
export const updateComment: CustomActionCreator<IComment> = (payload) => ({type: UPDATE_COMMENT, payload})

export const createComment = (newComment: IComment): CustomThunkActionCreator<IComment[] | LoadingState | LoadError | CountPayload> => async (dispatch) => {
	dispatch({type: SET_COMMENTS_LOADING, payload: true})
	dispatch({type: SET_COMMENTS_ERROR, payload: ''})

	let response = await ApiService.comments.add(getServerComment(newComment))
	if (response instanceof AxiosError) {
		let message = response.response?.data.message || DEFAULT_ERROR
		dispatch({type: SET_COMMENTS_ERROR, payload: message})
	}
	else if (response.data) {
		dispatch({type: ADD_COMMENT, payload: response.data})
		dispatch(updateCommentCount({taskId: response.data.taskId, increment: true}))
	}
	dispatch({type: SET_COMMENTS_LOADING, payload: false})
}
export const updateCommentList = (taskId: Id): CustomThunkActionCreator<IComment[] | LoadingState | LoadError | Id> => async (dispatch) => {
	dispatch({type: SET_COMMENTS_LOADING, payload: true})
	dispatch({type: SET_COMMENTS_ERROR, payload: ''})
	dispatch({type: RESTORE_PREV_COMMENT_LIST, payload: taskId})

	let response = await ApiService.comments.get(taskId)
	if (response instanceof AxiosError) {
		let message = response.response?.data.message || DEFAULT_ERROR
		dispatch({type: SET_COMMENTS_ERROR, payload: message})
	}
	else if (response.data) {
		let correctComment = response.data.map(item => getClientComment(item))
		dispatch({type: UPDATE_ALL_COMMENTS, payload: correctComment})
	}

	dispatch({type: SET_COMMENTS_LOADING, payload: false})
}


const getClientComment = (com: IServerComment) => {
	return {...com, date: new Date(com.date).getTime()}
}
const getServerComment = (com: IComment) => {
	return {...com, date: new Date(com.date)}
}
