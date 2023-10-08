// fake API through localStorage

import { _waitServerResponse } from '../utilities/utilities'
import defaultProjects from './defaultProjects.json'
import defaultTasks from './defaultTasks.json'
import defaultComments from './defaultComments.json'
import { IComment, IProject, ITask } from '../types/types'

const defaults = {
	projects: defaultProjects as IProject[],
	tasks: defaultTasks as ITask[],
	comments: defaultComments as IComment[],
}

export enum ApiRequest {
	projects = 'projects',
	tasks = 'tasks',
	comments = 'comments'
}
export type ApiData = IProject | ITask | IComment

export interface ApiBody {
	data: ApiData
}
export interface ApiResponse {
	ok?: boolean
	error?: Error
}
export interface ApiGetResponse<T> extends ApiResponse {
	data?: T[] //ApiData[]
}
interface Api {
	[key: string]: (request: ApiRequest, body: ApiBody) => Promise<ApiResponse>
	get: <T>(request: ApiRequest) => Promise<ApiGetResponse<T>>
}

export const api: Api = {

	async get<T>(request: ApiRequest) {
		await _waitServerResponse()
		let data = getData<T>(request)
		let newData
		if (data === null) {
			newData = defaults[request] as T[]
			setData(request, newData)
		}
		else newData = data
		return {ok: true, data: newData}
	},

	async post(request, body) {
		await _waitServerResponse()
		if (!body?.data) return {error: getError('post', '"data" is missing')}
		let data = getData(request)
		if (data === null) return {error: INTERNAL_ERROR}

		let IDs = data.map(item => item.id)
		let newItem = {...body.data, id: Math.max(...IDs) + 1}
		data.push(newItem)
		if (setData(request, data)) return {ok: true}
		else return {error: INTERNAL_ERROR}
	},

	async put(request, body) {
		await _waitServerResponse()
		if (!body?.data) return {error: getError('put', '"data" is missing')}
		let data = getData(request)
		if (data === null) return {error: INTERNAL_ERROR}

		const updatedItemIndex = data.findIndex(item => item.id === body.data.id)
		if (updatedItemIndex < 0) {
			return {error: getError('put', `item with "id=${body.data.id}" not found`)}
		}
		data[updatedItemIndex] = body.data
		if (setData(request, data)) return {ok: true}
		else return {error: INTERNAL_ERROR}
	},

	async delete(request, body) {
		await _waitServerResponse()
		if (!body?.data.id) return {error: getError('delete', '"id" is missing')}
		let data = getData(request)
		if (data === null) return {error: INTERNAL_ERROR}

		let isNotFoundItem = true
		let newData = data.filter(item => isNotFoundItem = item.id !== body.data.id)
		if (isNotFoundItem) return {error: getError('delete', `item with "id=${body.data.id}" not found`)}
		if (setData(request, newData)) return {ok: true}
		else return {error: INTERNAL_ERROR}
	}
}

function getData<T = ApiData>(name: string): T[] | null {
	let item = localStorage.getItem(name)
	return item ? JSON.parse(item) : null
}
function setData<T = ApiData>(name: string, data: T[]): boolean {
	localStorage.setItem(name, JSON.stringify(data))
	return true
}
function getError(method: 'get' | 'post' | 'put' | 'delete', message: string) {
	return new Error(`Error on ${method.toUpperCase()} request: ${message}`)
}

const INTERNAL_ERROR = new Error('Internal server error')
