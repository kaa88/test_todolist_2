import { api, ApiData, ApiRequest } from '../api/api'
import { Id, IComment, IProject, ITask } from '../types/types'
import { _waitServerResponse } from '../utilities/utilities'


class Actions<T extends ApiData> {
	get: () => ReturnType<typeof api.get<T>>
	add: (data: T) => ReturnType<typeof api.post>
	edit: (data: T) => ReturnType<typeof api.put>
	delete: (data: T) => ReturnType<typeof api.delete>
	constructor(request: ApiRequest) {
		this.get = async () => await api.get<T>(ApiRequest[request])
		this.add = async (data) => await api.post(ApiRequest[request], {data})
		this.edit = async (data) => await api.put(ApiRequest[request], {data})
		this.delete = async (data) => await api.delete(ApiRequest[request], {data})
	}
}


export const apiService = { // fake fetcher
	projects: new Actions<IProject>(ApiRequest.projects),
	// tasks: new Actions<ITask>(ApiRequest.tasks),
	comments: new Actions<IComment>(ApiRequest.comments),

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
		async get(projectId: Id) {
			let tasks = await api.get<ITask>(ApiRequest.tasks)
			return tasks.data ? tasks.data.filter(task => task.projectId === projectId) : []
		},
		// async getOne(taskId: Id) {
		// 	return await api.get<ITask>(ApiRequest.tasks)
		// },
		async add(task: ITask) {
			return await api.post(ApiRequest.tasks, {data: task})
		},
		async edit(task: ITask) {
			return await api.put(ApiRequest.tasks, {data: task})
		},
		async delete(task: ITask) {
			return await api.delete(ApiRequest.tasks, {data: task})
		},
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
