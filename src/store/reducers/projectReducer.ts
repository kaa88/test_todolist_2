import { ThunkAction } from "redux-thunk"
import { projectService } from "../../services/projectService"
import { IAction } from "../../types/reduxTypes"
import { IProject } from "../../types/types"
import { AppDispatch } from "../store"

const SET_ACTIVE = 'SET_ACTIVE'
const UPDATE_PROJECT_LIST = 'UPDATE_PROJECT_LIST'

type ICurrent = string | null

type ActionType = IAction<ICurrent | IProject[]>

interface IState {
	current: ICurrent
	list: IProject[]
}

const defaultState: IState = {
	current: null,
	list: []
}

const projectReducer = (state = defaultState, action: ActionType) => {
	switch (action.type) {
		case UPDATE_PROJECT_LIST:
			return {...state, list: action.payload || []}
		case SET_ACTIVE:
			let current = action.payload || null
			return {...state, current}
		default:
			return state
	}
}
export default projectReducer


export function setCurrentProject(payload: ICurrent) {
	return {type: SET_ACTIVE, payload}
}
// export function updateProjectList(payload: IProject[]) {
// 	return {type: UPDATE_PROJECT_LIST, payload}
// }
export function updateProjectList(): ThunkAction<Promise<void>, IState, unknown, ActionType> {
	return async (dispatch) => {
		let projects: IProject[] = await projectService.getProjects()
		dispatch({type: UPDATE_PROJECT_LIST, payload: projects})
	}
}
