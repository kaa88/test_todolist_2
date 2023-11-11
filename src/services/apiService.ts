import { api, ApiError, ApiMessage } from '../api/api'
import { Id, IServerComment, IProject, IServerTask, IUserServerSettings, IServerFile } from '../types/types'

const USER_PATH = '/user'
const PROJECTS_PATH = '/project'
const TASKS_PATH = '/task'
const COMMENTS_PATH = '/comment'
const FILES_PATH = '/file'


export const ApiService = {
	projects: {
		async get(userId: Id) {
			try {
				return await api.get<IProject[]>(`${PROJECTS_PATH}?userId=${userId}`)
			}
			catch (err: any) {
				return err as ApiError<ApiMessage>
			}
		},
		async add(project: IProject) {
			try {
				return await api.post<IProject>(PROJECTS_PATH, project)
			}
			catch (err: any) {
				return err as ApiError<ApiMessage>
			}
		},
		async edit(project: IProject) {
			try {
				return await api.put<ApiMessage>(PROJECTS_PATH, project)
			}
			catch (err: any) {
				return err as ApiError<ApiMessage>
			}
		},
		async delete(projectId: Id) {
			try {
				return await api.delete<ApiMessage>(`${PROJECTS_PATH}?id=${projectId}`)
			}
			catch (err: any) {
				return err as ApiError<ApiMessage>
			}
		},
	},
	tasks: {
		async getAll(projectId: Id | null) {
			try {
				const query = projectId === null ? '' : `?projectId=${projectId}`
				return await api.get<IServerTask[]>(`${TASKS_PATH}${query}`)
			}
			catch (err: any) {
				return err as ApiError<ApiMessage>
			}
		},
		async get(taskId: Id) {
			try {
				return await api.get<IServerTask[]>(`${TASKS_PATH}?id=${taskId}`)
			}
			catch (err: any) {
				return err as ApiError<ApiMessage>
			}
		},
		async add(task: IServerTask) {
			try {
				return await api.post<IServerTask>(TASKS_PATH, task)
			}
			catch (err: any) {
				return err as ApiError<ApiMessage>
			}
		},
		async edit(task: IServerTask) {
			try {
				return await api.put<ApiMessage>(TASKS_PATH, task)
			}
			catch (err: any) {
				return err as ApiError<ApiMessage>
			}
		},
		async delete(taskId: Id) {
			try {
				return await api.delete<ApiMessage>(`${TASKS_PATH}?id=${taskId}`)
			}
			catch (err: any) {
				return err as ApiError<ApiMessage>
			}
		},
	},
	comments: {
		async get(taskId: Id | null) {
			try {
				const query = taskId === null ? '' : `?taskId=${taskId}`
				return await api.get<IServerComment[]>(`${COMMENTS_PATH}${query}`)
			}
			catch (err: any) {
				return err as ApiError<ApiMessage>
			}
		},
		async add(comment: IServerComment) {
			try {
				return await api.post<IServerComment>(COMMENTS_PATH, comment)
			}
			catch (err: any) {
				return err as ApiError<ApiMessage>
			}
		},
		async edit(comment: IServerComment) {
			try {
				return await api.put<ApiMessage>(COMMENTS_PATH, comment)
			}
			catch (err: any) {
				return err as ApiError<ApiMessage>
			}
		},
		async delete(commentId: Id) {
			try {
				return await api.delete<ApiMessage>(`${COMMENTS_PATH}?id=${commentId}`)
			}
			catch (err: any) {
				return err as ApiError<ApiMessage>
			}
		},
	},
	files: {
		async get(taskId: Id | null) {
			try {
				const query = taskId === null ? '' : `?taskId=${taskId}`
				return await api.get<IServerFile[]>(`${FILES_PATH}${query}`)
			}
			catch (err: any) {
				return err as ApiError<ApiMessage>
			}
		},
		async add(file: IServerFile) {
			try {
				return await api.post<IServerFile>(FILES_PATH, file)
			}
			catch (err: any) {
				return err as ApiError<ApiMessage>
			}
		},
		async delete(fileId: Id) {
			try {
				return await api.delete<ApiMessage>(`${FILES_PATH}?id=${fileId}`)
			}
			catch (err: any) {
				return err as ApiError<ApiMessage>
			}
		},
	},
	user: {
		async get(userId: Id) {
			try {
				return await api.get<IUserServerSettings[]>(`${USER_PATH}?id=${userId}`)
			}
			catch (err: any) {
				return err as ApiError<ApiMessage>
			}
		},
		async add() {
			try {
				return await api.post<IUserServerSettings>(USER_PATH)
			}
			catch (err: any) {
				return err as ApiError<ApiMessage>
			}
		},
		async edit(settings: IUserServerSettings) {
			try {
				return await api.put<ApiMessage>(USER_PATH, settings)
			}
			catch (err: any) {
				return err as ApiError<ApiMessage>
			}
		},
	}
}

// TODO: create common class like this:
// class Actions<T> {
// 	get: () => Promise<ApiResponse<T>>
// 	add: (data: T) => Promise<ApiResponse<T>>
// 	edit: (data: T) => Promise<ApiResponse<T>>
// 	delete: (id: Id) => Promise<ApiResponse>
// 	constructor(request: string) {
// 		this.get = async () => await api.get<T>(request)
// 		this.add = async (data) => await api.post(request, {data})
// 		this.edit = async (data) => await api.put(request, {data})
// 		this.delete = async (id) => await api.delete(`${request}?id=${id}`)
// 	}
// }

// projects: new Actions<IProject>(PROJECTS_PATH),
