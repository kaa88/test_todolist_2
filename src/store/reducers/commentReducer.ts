import { Reducer } from "redux"
import { CustomAction, CustomActionCreator, CustomThunkActionCreator } from "../../types/reduxTypes"
import { Id, ISubtask, IComment } from "../../types/types"
import { ApiService } from "../../services/ApiService"

type LoadingState = boolean
type LoadError = string

interface CommentState {
	isLoading: LoadingState
	loadError: LoadError
	list: IComment[]
}

type Actions =
	  CustomAction<LoadingState>
	| CustomAction<LoadError>
	| CustomAction<IComment>
	| CustomAction<IComment[]>

const initialState: CommentState = {
	isLoading: false,
	loadError: '',
	list: [],
}

const SET_COMMENTS_LOADING = 'SET_COMMENTS_LOADING'
const SET_COMMENTS_ERROR = 'SET_COMMENTS_ERROR'
const UPDATE_ALL_COMMENTS = 'UPDATE_ALL_COMMENTS'
const UPDATE_COMMENT = 'UPDATE_COMMENT'
const ADD_COMMENT = 'ADD_COMMENT'

export const commentReducer: Reducer<CommentState, Actions> = (state = initialState, action) => {
	let comment: IComment, index: number, newList: IComment[]
	switch(action.type) {
		case SET_COMMENTS_LOADING:
			return {...state, isLoading: action.payload as LoadingState}
		case SET_COMMENTS_ERROR:
			return {...state, loadError: action.payload as LoadError}
		case UPDATE_ALL_COMMENTS:
			return {...state, list: action.payload as IComment[]}
		case UPDATE_COMMENT:
			comment = action.payload as IComment
			index = state.list.findIndex(c => c.id === comment.id)
			if (index < 0) return state
			newList = [...state.list]
			newList[index] = comment
			ApiService.comments.edit(comment)
			return {...state, list: newList}
		case ADD_COMMENT:
			comment = action.payload as IComment
			newList = [...state.list]
			newList.push(comment)
			ApiService.comments.add(comment)
			return {...state, list: newList}
		default:
			return state
	}
}

export const createComment: CustomActionCreator<IComment> = (payload) => ({type: ADD_COMMENT, payload})
export const updateComment: CustomActionCreator<IComment> = (payload) => ({type: UPDATE_COMMENT, payload})

export const updateCommentList = (taskId: Id): CustomThunkActionCreator<IComment[] | LoadingState | LoadError> => async (dispatch) => {
	console.log('updateCommentList')
	dispatch({type: SET_COMMENTS_LOADING, payload: true})
	dispatch({type: SET_COMMENTS_ERROR, payload: ''})
	dispatch({type: UPDATE_ALL_COMMENTS, payload: []})

	let response = await ApiService.comments.get(taskId)
	if (response.error) dispatch({type: SET_COMMENTS_ERROR, payload: response.error.message})
	else if (response.data) dispatch({type: UPDATE_ALL_COMMENTS, payload: response.data})

	dispatch({type: SET_COMMENTS_LOADING, payload: false})
}
