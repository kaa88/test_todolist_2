export enum TaskPriority {
	normal = 'normal',
	high = 'high',
	top = 'top',
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
	description: string
	createDate: number
	expireDate: number
	priority: TaskPriority
	status: TaskStatus
	subtasks: ISubtask[]
	attached: string[]
}
export interface ISubtask {
	title: string
	isDone: boolean
}
export interface INewComment {
	parentId: Id | null
	date: number
	author: string
	content: string
	// isSub: boolean
}
export interface IComment extends INewComment {
	id: Id
	taskId: Id
	// subcomments: Id[]
	rating: number
}
