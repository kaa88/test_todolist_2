export enum TaskPriority {
	low = 'low',
	normal = 'normal',
	high = 'high',
}
export enum TaskStatus {
	queue = 'queue',
	dev = 'development',
	done = 'done',
}

export type Id = number

export interface IProject {
	id: Id
	name: string
}

export interface ITask {
	id: Id
	projectId: Id
	title: string
	description?: string
	createDate: number
	expireDate: number
	priority: TaskPriority
	status: TaskStatus
	subtasks?: ISubtask[]
	commentIds?: Id[]
	attached?: string[] //?
}
export interface ISubtask {
	title: string
	isDone: boolean
}
export interface IComment {
	id: Id
	author: string
	comment: string
	subcommentIds?: number[]
}
