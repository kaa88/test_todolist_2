import { Reducer } from "redux"
import { CustomAction, CustomActionCreator } from "../../types/reduxTypes"

interface ModalState {
	active: string,
	content: any
}
type ModalPayload = {name: string, content?: any} | string | null | undefined

type Actions = CustomAction<ModalPayload>

const initialState: ModalState = {
	active: '',
	content: null
}

const SET_ACTIVE_MODAL = 'SET_ACTIVE_MODAL'

export const modalReducer: Reducer<ModalState, Actions> = (state = initialState, action) => {
	switch(action.type) {
		case SET_ACTIVE_MODAL:
			if (!action.payload) return initialState
			if (typeof action.payload === 'string') return {...state, active: action.payload, content: null}
			if (typeof action.payload === 'object' && !Array.isArray(action.payload))
				return {...state, active: action.payload.name || '', content: action.payload.content || null}
			return state
		default:
			return state
	}
}

export const setActiveModal: CustomActionCreator<ModalPayload> = (payload) => ({type: SET_ACTIVE_MODAL, payload})
