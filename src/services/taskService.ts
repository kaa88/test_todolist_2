import { Id, ITask } from '../types/types'
import defaultTasks from '../data/defaultTasks.json'
import { _wait } from '../utilities/utilities'


export const taskService = { // fake fetcher
	async setTasks(projectId: Id, value: ITask[]) {
		await _wait()
		setTasks(projectId, value)
	},
	async getTasks(projectId: Id) {
		await _wait()
		return getTasks(projectId)
	}
}


const storageNamePrefix = 'project'

function setTasks(projectId: Id, value: ITask[]) {
	localStorage.setItem(storageNamePrefix + projectId, JSON.stringify(value))
}
function getTasks(projectId: Id) {
	let item = localStorage.getItem(storageNamePrefix + projectId)
	if (item) return JSON.parse(item)
	else {
		let tasks = getDefaultTasks(projectId)
		setTasks(projectId, tasks)
		return tasks
	}
}

function getDefaultTasks(projectId: Id) {
	return defaultTasks.filter(task => task.projectId === projectId) as ITask[]
}
