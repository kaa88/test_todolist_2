import { Reducer } from "redux"
import { CustomAction, CustomActionCreator, CustomThunkActionCreator } from "../../types/reduxTypes"
import { Id, ISubtask, ITask, TaskPriority, TaskStatus } from "../../types/types"
import { ApiService } from "../../services/ApiService"
import { objectIsEmpty } from "../../utilities/utilities"

type LoadingState = boolean
type LoadError = string
type NewTaskCallback = (task: ITask) => ITask

interface TaskUpdatePayload {
	taskId: ITask['id']
	values: {
		title?: ITask['title']
		description?: ITask['description']
		createDate?: ITask['createDate']
		expireDate?: ITask['expireDate']
		priority?: ITask['priority']
		status?: ITask['status']
		subtasks?: ITask['subtasks']
	}
}
export type CommentCountPayload = {
	taskId: Id
	count?: number
	increment?: boolean
	decrement?: boolean
}
// interface SubtaskPayload {
// 	taskId: Id
// 	subtasks: ISubtask[]
// }

type Payloads = TaskUpdatePayload | CommentCountPayload // | SubtaskPayload

type Actions =
	  CustomAction<LoadingState>
	| CustomAction<LoadError>
	| CustomAction<ITask>
	| CustomAction<ITask[]>
	| CustomAction<TaskUpdatePayload>
	// | CustomAction<SubtaskPayload>
	| CustomAction<CommentCountPayload>

interface TaskState {
	isLoading: LoadingState
	loadError: LoadError
	list: ITask[]
	lastAddedTaskId: Id | null
}

const initialState: TaskState = {
	isLoading: false,
	loadError: '',
	list: [],
	lastAddedTaskId: null
}

const SET_TASKS_LOADING = 'SET_TASKS_LOADING'
const SET_TASKS_ERROR = 'SET_TASKS_ERROR'
const SET_PROJECT_TASK_LIST = 'SET_PROJECT_TASK_LIST'
const CREATE_TASK = 'CREATE_TASK'
const DELETE_TASK = 'DELETE_TASK'
const UPDATE_TASK = 'UPDATE_TASK'
// const UPDATE_TASK_SUBTASKS = 'UPDATE_TASK_SUBTASKS'
const UPDATE_TASK_COMMENT_COUNT = 'UPDATE_TASK_COMMENT_COUNT'
// const UPDATE_TASK_ATTACHED = 'UPDATE_TASK_ATTACHED'

export const taskReducer: Reducer<TaskState, Actions> = (state = initialState, action) => {
	let newList: ITask[] | null, newTaskCallback: NewTaskCallback
	switch(action.type) {
		case SET_TASKS_LOADING:
			return {...state, isLoading: action.payload as LoadingState}

		case SET_TASKS_ERROR:
			return {...state, loadError: action.payload as LoadError}

		case SET_PROJECT_TASK_LIST:
			return {...state, list: action.payload as ITask[]}

		case CREATE_TASK:
			const [createdTask] = action.payload as ITask[]
			newList = [...state.list]
			newList.push(createdTask)
			return {...state, list: newList, lastAddedTaskId: createdTask.id}

		case DELETE_TASK:
			const deletedTask = action.payload as ITask
			newList = state.list.filter(item => item.id !== deletedTask.id)
			ApiService.tasks.delete(deletedTask.id)
			return {...state, list: newList}

		case UPDATE_TASK:
			const taskUpdatePayload = action.payload as TaskUpdatePayload
			if (objectIsEmpty(taskUpdatePayload.values)) return state
			newTaskCallback = (task) => ({...task, ...taskUpdatePayload.values})
			newList = getUpdatedList(state.list, taskUpdatePayload, newTaskCallback)
			return newList ? {...state, list: newList} : state

		case UPDATE_TASK_COMMENT_COUNT:
			const commentPayload = action.payload as CommentCountPayload
			newTaskCallback = (task) => {
				let count = task.commentsCount || 0
				if (commentPayload.increment) count += 1
				if (commentPayload.decrement) count = count > 0 ? count - 1 : count
				if (commentPayload.count) count = commentPayload.count
				return {...task, commentsCount: count}
			}
			newList = getUpdatedList(state.list, commentPayload, newTaskCallback)
			return newList ? {...state, list: newList} : state

		default:
			return state
	}
}

// Action Creators
export const updateTask: CustomActionCreator<TaskUpdatePayload> = (payload) => ({type: UPDATE_TASK, payload})
export const updateCommentCount: CustomActionCreator<CommentCountPayload> = (payload) => ({type: UPDATE_TASK_COMMENT_COUNT, payload})
export const deleteTask: CustomActionCreator<ITask> = (payload) => ({type: DELETE_TASK, payload})

// Thunk Action Creators
export const createNewTask = (projectId: Id): CustomThunkActionCreator<ITask[] | LoadingState | LoadError> => async (dispatch) => {
	dispatch({type: SET_TASKS_LOADING, payload: true})
	dispatch({type: SET_TASKS_ERROR, payload: ''})

	const newTask = {
		id: 0,
		projectId,
		title: '',
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
	dispatch({type: SET_PROJECT_TASK_LIST, payload: []})

	let response = await ApiService.tasks.getAll(projectId)
	if (response.error) dispatch({type: SET_TASKS_ERROR, payload: response.error.message})
	else if (response.data) dispatch({type: SET_PROJECT_TASK_LIST, payload: response.data})

	dispatch({type: SET_TASKS_LOADING, payload: false})
}




function getUpdatedList(currentList: ITask[], payload: Payloads, getNewTask: NewTaskCallback) {
	let taskIndex = currentList.findIndex(t => t.id === payload.taskId)
	if (taskIndex < 0) return null
	let newTask = getNewTask(currentList[taskIndex])
	let newList = [...currentList]
	newList[taskIndex] = newTask
	ApiService.tasks.edit(newTask) // Sorry, I have to put it down here for a while
	return newList
}
