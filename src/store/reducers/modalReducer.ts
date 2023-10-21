import { Reducer } from "redux"
import { CustomAction, CustomActionCreator } from "../../types/reduxTypes"

interface ModalState {
	closeTrigger: number,
}
type ModalPayload = void

type Actions = CustomAction<ModalPayload>

const initialState: ModalState = {
	closeTrigger: 0
}

const UPDATE_MODAL_CLOSE_TRIGGER_ID = 'UPDATE_MODAL_CLOSE_TRIGGER_ID'

export const modalReducer: Reducer<ModalState, Actions> = (state = initialState, action) => {
	switch(action.type) {
		case UPDATE_MODAL_CLOSE_TRIGGER_ID:
			return {...state, closeTrigger: state.closeTrigger + 1}
		default:
			return state
	}
}

export const closeAllModals: CustomActionCreator<ModalPayload> = (payload) => ({type: UPDATE_MODAL_CLOSE_TRIGGER_ID, payload})
