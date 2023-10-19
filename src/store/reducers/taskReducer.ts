import { Reducer } from "redux"
import { CustomAction, CustomActionCreator, CustomThunkActionCreator } from "../../types/reduxTypes"
import { Id, ISubtask, ITask, TaskPriority, TaskStatus } from "../../types/types"
import { ApiService } from "../../services/ApiService"

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

type Actions =
	  CustomAction<LoadingState>
	| CustomAction<LoadError>
	| CustomAction<ITask>
	| CustomAction<ITask[]>
	| CustomAction<SubtaskPayload>

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
const CREATE_TASK = 'CREATE_TASK'
const DELETE_TASK = 'DELETE_TASK'

export const taskReducer: Reducer<TaskState, Actions> = (state = initialState, action) => {
	let task: ITask, taskIndex: number, newList: ITask[]
	switch(action.type) {
		case SET_TASKS_LOADING:
			return {...state, isLoading: action.payload as LoadingState}
		case SET_TASKS_ERROR:
			return {...state, loadError: action.payload as LoadError}
		case UPDATE_PROJECT_TASKS:
			return {...state, list: action.payload as ITask[]}
		case UPDATE_CURRENT_TASK:
			task = action.payload as ITask
			taskIndex = state.list.findIndex(t => t.id === task.id)
			if (taskIndex < 0) return state
			newList = [...state.list]
			newList[taskIndex] = task
			ApiService.tasks.edit(task)
			return {...state, list: newList}
		case UPDATE_SUBTASKS:
			let {taskId, subtasks} = action.payload as SubtaskPayload
			taskIndex = state.list.findIndex(t => t.id === taskId)
			if (taskIndex < 0) return state
			newList = [...state.list]
			newList[taskIndex].subtasks = subtasks
			ApiService.tasks.edit(newList[taskIndex])
			return {...state, list: newList}
		case CREATE_TASK:
			const [newTask] = action.payload as ITask[]
			newList = [...state.list]
			newList.push(newTask)
			return {...state, list: newList}
		case DELETE_TASK:
			task = action.payload as ITask
			newList = state.list.filter(item => item.id !== task.id)
			ApiService.tasks.delete(task.id)
			return {...state, list: newList}
		default:
			return state
	}
}

export const updateCurrentTask: CustomActionCreator<ITask> = (payload) => ({type: UPDATE_CURRENT_TASK, payload})
export const updateSubtasks: CustomActionCreator<SubtaskPayload> = (payload) => ({type: UPDATE_SUBTASKS, payload})
export const deleteTask: CustomActionCreator<ITask> = (payload) => ({type: DELETE_TASK, payload})

export const createNewTask = (projectId: Id): CustomThunkActionCreator<ITask[] | LoadingState | LoadError> => async (dispatch) => {
	dispatch({type: SET_TASKS_LOADING, payload: true})
	dispatch({type: SET_TASKS_ERROR, payload: ''})

	const newTask = {
		id: 0,
		projectId,
		title: 'New task',
		description: '',
		createDate: Date.now(),
		expireDate: Date.now() + 24*60*60*1000, // +1d
		priority: TaskPriority.normal,
		status: TaskStatus.queue,
		subtasks: [],
		attached: [],
	}
	let response = await ApiService.tasks.add(newTask)
	if (response.error) dispatch({type: SET_TASKS_ERROR, payload: response.error.message})
	else if (response.data) dispatch({type: CREATE_TASK, payload: response.data})

	dispatch({type: SET_TASKS_LOADING, payload: false})
}
export const updateTaskList = (projectId: Id): CustomThunkActionCreator<ITask[] | LoadingState | LoadError> => async (dispatch) => {
	dispatch({type: SET_TASKS_LOADING, payload: true})
	dispatch({type: SET_TASKS_ERROR, payload: ''})
	dispatch({type: UPDATE_PROJECT_TASKS, payload: []})

	let response = await ApiService.tasks.getAll(projectId)
	if (response.error) dispatch({type: SET_TASKS_ERROR, payload: response.error.message})
	else if (response.data) dispatch({type: UPDATE_PROJECT_TASKS, payload: response.data})

	dispatch({type: SET_TASKS_LOADING, payload: false})
}
