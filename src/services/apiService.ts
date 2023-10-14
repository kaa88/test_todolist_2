import { api, ApiData, ApiGetResponse } from '../api/api'
import { Id, IComment, IProject, ITask } from '../types/types'
import { _waitServerResponse } from '../utilities/utilities'

const PROJECTS_PATH = '/api/projects'
const TASKS_PATH = '/api/tasks'
const COMMENTS_PATH = '/api/comments'


class Actions<T extends ApiData> {
	get: () => ReturnType<typeof api.get<T>>
	add: (data: T) => ReturnType<typeof api.post>
	edit: (data: T) => ReturnType<typeof api.put>
	delete: (id: Id) => ReturnType<typeof api.delete>
	constructor(request: string) {
		this.get = async () => await api.get<T>(request)
		this.add = async (data) => await api.post(request, {data})
		this.edit = async (data) => await api.put(request, {data})
		this.delete = async (id) => await api.delete(`${request}?id=${id}`)
	}
}


export const ApiService = { // fake fetcher
	projects: new Actions<IProject>(PROJECTS_PATH),
	// tasks: new Actions<ITask>(ApiRequest.tasks),
	comments: new Actions<IComment>(COMMENTS_PATH),

	// // projects
	// async getProjects() {
	// 	return await api.get(ApiRequest.projects)
	// },
	// async addProject(project: IProject) {
	// 	return await api.post(ApiRequest.projects, {data: project})
	// },
	// async editProject(project: IProject) {
	// 	return await api.put(ApiRequest.projects, {data: project})
	// },
	// async deleteProject(project: IProject) {
	// 	return await api.delete(ApiRequest.projects, {data: project})
	// },
	// // tasks
	tasks: {
		async getAll(projectId: Id | null) {
			let tasks = await api.get<ITask>(TASKS_PATH)
			if (projectId !== null) {
				let data = tasks.data ? tasks.data.filter(task => task.projectId === projectId) : []
				return {...tasks, data} as ApiGetResponse<ITask>
			}
			return tasks
		},
		async get(taskId: Id) {
			return await api.get<ITask>(`${TASKS_PATH}?id=${taskId}`)
		},
		async add(task: ITask) {
			return await api.post(TASKS_PATH, {data: task})
		},
		async edit(task: ITask) {
			return await api.put(TASKS_PATH, {data: task})
		},
		async delete(taskId: Id) {
			return await api.delete(`${TASKS_PATH}?id=${taskId}`)
		},
		// async get(taskId: Id) {
		// 	return await api.get<ITask>(ApiRequest.tasks)
		// },
		// async add(task: ITask) {
		// 	return await api.post(ApiRequest.tasks, {data: task})
		// },
		// async edit(task: ITask) {
		// 	return await api.put(ApiRequest.tasks, {data: task})
		// },
		// async delete(task: ITask) {
		// 	return await api.delete(ApiRequest.tasks, {data: task})
		// },
	}
	// // comments
	// async getComments() {
	// 	return await api.get(ApiRequest.comments)
	// },
	// async addComment(comment: IComment) {
	// 	return await api.post(ApiRequest.comments, {data: comment})
	// },
	// async editComment(comment: IComment) {
	// 	return await api.put(ApiRequest.comments, {data: comment})
	// },
	// async deleteComment(comment: IComment) {
	// 	return await api.delete(ApiRequest.comments, {data: comment})
	// },
}
