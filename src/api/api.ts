// fake API through localStorage

import { _waitServerResponse } from '../utilities/utilities'
import { IComment, IProject, ITask } from '../types/types'
import defaultProjects from './defaultProjects.json'
import defaultTasks from './defaultTasks.json'
import defaultComments from './defaultComments.json'

const defaults: {[key: string]: ApiData[]} = {
	projects: defaultProjects as IProject[],
	tasks: defaultTasks as ITask[],
	comments: defaultComments as IComment[],
}

export type Url = string

interface ParsedUrl {
	endpoint: string
	query?: {[key: string]: string | number}
}

// export enum ApiRequest { //?
// 	projects = 'projects',
// 	tasks = 'tasks',
// 	comments = 'comments'
// }
export type ApiData = IProject | ITask | IComment

export interface ApiBody<T> {
	data: T//ApiData
}
export interface ApiResponse {
	ok?: boolean
	error?: Error
}
export interface ApiGetResponse<T> extends ApiResponse {
	data?: T[]
}
// interface Api {
// 	[key: string]: (url: Url, body: ApiBody) => Promise<ApiResponse>
	// get: <T extends ApiData>(url: Url) => Promise<ApiGetResponse<T>>
// }

export const api = {

	async get<T extends ApiData>(url: Url): Promise<ApiGetResponse<T>> {
		await _waitServerResponse()
		const {endpoint, query} = parseUrl(url)
		let data = getData<T>(endpoint)
		if (data === null) {
			data = defaults[endpoint] as T[]
			setData(endpoint, data)
		}
		let dataItem: T | undefined
		if (query?.id) dataItem = data.find(item => item.id === query.id)
		return {ok: true, data: dataItem ? [dataItem] : data}
	},

	async post<T extends ApiData>(url: Url, body: ApiBody<T>): Promise<ApiGetResponse<T>> {
		await _waitServerResponse()
		if (!body?.data) return {error: getError('post', '"data" is missing')}
		const {endpoint} = parseUrl(url)
		let data = getData<T>(endpoint)
		if (data === null) return {error: INTERNAL_ERROR}

		let maxID = data.reduce((result, item) => (
			item.id > result ? item.id : result
		), 0)
		let newItem = {...body.data, id: maxID + 1}
		data.push(newItem)
		if (setData(endpoint, data)) return {ok: true, data: [newItem]}
		else return {error: INTERNAL_ERROR}
	},

	async put<T extends ApiData>(url: Url, body: ApiBody<T>): Promise<ApiGetResponse<T>> {
		await _waitServerResponse()
		if (!body?.data) return {error: getError('put', '"data" is missing')}
		const {endpoint} = parseUrl(url)
		let data = getData<T>(endpoint)
		if (data === null) return {error: INTERNAL_ERROR}

		const updatedItemIndex = data.findIndex(item => item.id === body.data.id)
		if (updatedItemIndex < 0) {
			return {error: getError('put', `item with "id=${body.data.id}" not found`)}
		}
		data[updatedItemIndex] = body.data
		if (setData(endpoint, data)) return {ok: true, data: [data[updatedItemIndex]]}
		else return {error: INTERNAL_ERROR}
	},

	async delete(url: Url): Promise<ApiResponse> {
		await _waitServerResponse()
		const {endpoint, query} = parseUrl(url)
		if (!query?.id) return {error: getError('delete', '"id" is missing')}
		let data = getData(endpoint)
		if (data === null) return {error: INTERNAL_ERROR}

		let isNotFoundItem = true
		let newData = data.filter(item => isNotFoundItem = item.id !== query.id)
		if (isNotFoundItem) return {error: getError('delete', `item with "id=${query.id}" not found`)}
		if (setData(endpoint, newData)) return {ok: true}
		else return {error: INTERNAL_ERROR}
	}
}

const INTERNAL_ERROR = new Error('Internal server error')

function getError(method: 'get' | 'post' | 'put' | 'delete', message: string) {
	return new Error(`Error on ${method.toUpperCase()} request: ${message}`)
}

function getData<T = ApiData>(name: string): T[] | null {
	let item = localStorage.getItem(name)
	return item ? JSON.parse(item) : null
}
function setData<T = ApiData>(name: string, data: T[]): boolean {
	localStorage.setItem(name, JSON.stringify(data))
	return true
}

function parseUrl(url: string): ParsedUrl {
	let [path, query] = url.split('?')
	let pathSplit = path.split('/')
	let endpoint = pathSplit[pathSplit.length - 1]
	let parsed: ParsedUrl = { endpoint }
	let queryParams = query ? query.split('&') : []
	if (queryParams.length) {
		parsed.query = Object.fromEntries(queryParams.map(item => {
			let [key, value] = item.split('=')
			return [key, isNaN(Number(value)) ? value : Number(value)]
		}))
	}
	return parsed
}