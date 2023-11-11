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
export enum TaskSort {
	id = 'id',
	creation = 'creation',
	expiration = 'expiration',
	priority = 'priority',
}
export enum PageType {
	default = '',
	projects = 'projects',
	tasks = 'tasks',
}

export type Id = number

export interface IProject {
	id: Id
	name: string
}

interface TaskProto {
	id: Id
	projectId: Id
	title: string
	description: string
	priority: TaskPriority
	status: TaskStatus
	commentsCount?: number
	filesCount?: number
}
export interface ITask extends TaskProto {
	createDate: number
	expireDate: number
	subtasks: ISubtask[]
}
export interface IServerTask extends TaskProto {
	createDate: Date
	expireDate: Date
	subtasks: string | object
}
export interface ISubtask {
	id: Id
	title: string
	isDone: boolean
}

export interface INewComment {
	parentCommentId: Id | null
	author: string
	content: string
	date: number
}
export interface IComment extends INewComment {
	id: Id
	taskId: Id
	rating: number
}
export interface IServerComment extends Omit<IComment, 'date'> {
	date: Date
}

export interface IFile {
	id: Id
	taskId: Id
	date: number
	path: string
	description: string
}
export interface IServerFile extends Omit<IFile, 'date'> {
	date: Date
}
export class IUserServerSettings {
	id!: Id
	showSubtasks!: boolean
	sortBy!: TaskSort
	queueAscendingOrder!: boolean
	devAscendingOrder!: boolean
	doneAscendingOrder!: boolean
}
export class IUserClientSettings {
	id!: Id | null
	showSubtasks!: boolean
	sortBy!: TaskSort
	taskGroupAscendingOrder!: {[key: string]: boolean}
}
