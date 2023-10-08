import { Reducer } from "redux"
import { CustomAction, CustomActionCreator, CustomThunkActionCreator } from "../../types/reduxTypes"
import { Id, ISubtask, ITask } from "../../types/types"
import { apiService } from "../../services/apiService"

type CurrentTaskName = string
type LoadingState = boolean
type LoadError = string

interface TaskState {
	isLoading: LoadingState
	loadError: LoadError
	list: ITask[]
}

interface SubtaskPayload {
	taskId: Id
	subtasks: ISubtask[]
}

type Actions = CustomAction<CurrentTaskName> | CustomAction<ITask[]> | CustomAction<LoadingState> | CustomAction<SubtaskPayload>

const initialState: TaskState = {
	isLoading: false,
	loadError: '',
	list: [],
}

const SET_TASKS_LOADING = 'SET_TASKS_LOADING'
const SET_TASKS_ERROR = 'SET_TASKS_ERROR'
const UPDATE_PROJECT_TASKS = 'UPDATE_PROJECT_TASKS'
const UPDATE_CURRENT_TASK = 'UPDATE_CURRENT_TASK'
const UPDATE_SUBTASKS = 'UPDATE_SUBTASKS'

export const taskReducer: Reducer<TaskState, Actions> = (state = initialState, action) => {
	switch(action.type) {
		case SET_TASKS_LOADING:
			return {...state, isLoading: action.payload as LoadingState}
		case SET_TASKS_ERROR:
			return {...state, loadError: action.payload as LoadError}
		case UPDATE_PROJECT_TASKS:
			return {...state, list: action.payload as ITask[]}
		case UPDATE_SUBTASKS:
			let {subtasks, taskId} = action.payload as SubtaskPayload
			let updatedTaskIndex = state.list.findIndex(task => task.id === taskId)
			let newList = [...state.list]
			newList[updatedTaskIndex].subtasks = subtasks
			return {...state, list: newList}
		default:
			return state
	}
}

export const updateSubtasks: CustomActionCreator<SubtaskPayload> = (payload) => ({type: UPDATE_SUBTASKS, payload})

export const updateTaskList = (projectId: Id): CustomThunkActionCreator<ITask[] | LoadingState | LoadError> => async (dispatch) => {
	console.log('updateTaskList')
	dispatch({type: SET_TASKS_LOADING, payload: true})
	dispatch({type: SET_TASKS_ERROR, payload: ''})
	dispatch({type: UPDATE_PROJECT_TASKS, payload: []})

	let response = await apiService.tasks.get(projectId)
	if (response.error) dispatch({type: SET_TASKS_ERROR, payload: response.error.message})
	else if (response.data) dispatch({type: UPDATE_PROJECT_TASKS, payload: response.data})

	dispatch({type: SET_TASKS_LOADING, payload: false})
}
