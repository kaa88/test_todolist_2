import { ComponentPropsWithoutRef, useEffect, useState, MouseEvent } from 'react';
import classes from './TodosTable.module.scss';
import Container from '../../ui/Container/Container';
import { ITask, Id, TaskPriority, TaskSort, TaskStatus } from '../../../types/types';
import Task from '../Task/Task';
import { useAppDispatch, useAppSelector } from '../../../hooks/typedReduxHooks';
import { updateTask, updateTaskList } from '../../../store/reducers/taskReducer';
import { DragDropContext, Droppable, Draggable, OnDragEndResponder, OnDragUpdateResponder, OnDragStartResponder } from 'react-beautiful-dnd';
import LoadError from '../../ui/Loader/LoadError';
import Loader from '../../ui/Loader/Loader';
import Icon from '../../ui/Icon/Icon';
import Header from '../Header/Header';
import { updateSettings } from '../../../store/reducers/userReducer';
import { Modal } from '../../ui/Modal/Modal';
import FullTask from '../FullTask/FullTask';

interface TodosTableProps extends ComponentPropsWithoutRef<'div'> {
	project: number
}

const TodosTable = function({project, className = ''}: TodosTableProps) {

	const dispatch = useAppDispatch()

	let projects = useAppSelector(state => state.projects.list)
	const currentProject = projects.find(p => p.id === project)
	let {isLoading, loadError, list: tasks} = useAppSelector(state => state.tasks)

	useEffect(() => {
		dispatch(updateTaskList(project))
	}, [project])


	const userSettings = useAppSelector(state => state.user)

	interface TaskGroup {
		status: TaskStatus
		header: string
		list: ITask[]
		isAscending: boolean
	}

	const groupAscendingOrder = userSettings.taskGroupAscendingOrder || {}
	const taskGroups: TaskGroup[] = [
		{
			status: TaskStatus.queue,
			header: 'Queue',
			list: [],
			isAscending: groupAscendingOrder[TaskStatus.queue]
		},
		{
			status: TaskStatus.dev,
			header: 'Development',
			list: [],
			isAscending: groupAscendingOrder[TaskStatus.dev]
		},
		{
			status: TaskStatus.done,
			header: 'Done',
			list: [],
			isAscending: groupAscendingOrder[TaskStatus.done]
		},
	]
	tasks.forEach(task => {
		let group = taskGroups.find(gr => gr.status === task.status)
		group?.list.push(task)
	})
	taskGroups.forEach(gr => {
		const sortBy = userSettings.sortBy
		if (sortBy === TaskSort.id) {
			gr.list.sort((a,b) => b.id - a.id)
		}
		if (sortBy === TaskSort.creation) {
			gr.list.sort((a,b) => b.createDate - a.createDate)
		}
		if (sortBy === TaskSort.expiration) {
			gr.list.sort((a,b) => b.expireDate - a.expireDate)
		}
		if (sortBy === TaskSort.priority) {
			gr.list.sort((a,b) => {
				let result = getPriorityWeight(b.priority) - getPriorityWeight(a.priority)
				return result || a.expireDate - b.expireDate
			})
		}
		if (gr.isAscending) gr.list.reverse()
	})

	const changeGroupOrder = (e: MouseEvent<HTMLButtonElement>) => {
		const targetStatus = e.currentTarget.dataset.status
		if (!targetStatus) return;
		const newStatus = groupAscendingOrder[targetStatus] ? false : true
		dispatch(updateSettings({
			...userSettings,
			taskGroupAscendingOrder: {
				...userSettings.taskGroupAscendingOrder,
				[targetStatus]: newStatus
			}
		}))
	}


	const moveTasksOnDrag = false
	
	let [currentDraggedTaskID, setCurrentDraggedTaskID] = useState<Id | null>(null)
	let [isDragging, setIsDragging] = useState(false)
	let [dragHoveredCell, setDragHoveredCell] = useState<TaskStatus | null>(null)

	const changeTaskStatus = (task: ITask, newStatus: TaskStatus) => {
		dispatch(updateTask({taskId: task.id, values: {status: newStatus}}))
	}
	const handleDragStart: OnDragStartResponder = (start) => {
		setIsDragging(true)
		let taskId = parseDraggableID(start.draggableId)
		setCurrentDraggedTaskID(typeof taskId === 'number' ? taskId : null)
	}
	const handleDragUpdate: OnDragUpdateResponder = ({destination}) => {
		let status = destination ? destination.droppableId as TaskStatus : null
		setDragHoveredCell(status)
	}
	const handleDragEnd: OnDragEndResponder = ({source, destination}) => {
		setIsDragging(false)
		setCurrentDraggedTaskID(null)
		if (!destination) return; // dropped outside the list
		if (source.droppableId === destination.droppableId) {
			return;
		} else {
			let prevStatus = source.droppableId as TaskStatus
			let newStatus = destination.droppableId as TaskStatus
			let droppableIndex = source.index
			let group = taskGroups.find(gr => gr.status === prevStatus)
			let currentTask = group?.list[droppableIndex]
			if (currentTask) changeTaskStatus(currentTask, newStatus)
		}
	}

	// Modal
	let [currentTask, setCurrentTask] = useState<ITask | null>(null)
	let [isModalActive, setIsModalActive] = useState(false)
	const handleModalOpen = (taskObject: ITask) => {
		setCurrentTask(taskObject)
		setIsModalActive(true)
	}
	const handleModalClose = () => {
		setIsModalActive(false)
	}
	// /Modal

	const getTaskElements = (group: ITask[]) =>
		group.map((task, index) =>
			<Draggable
				draggableId={getDraggableID(task.id)}
				key={index}
				index={index}
			>
				{(provided, snapshot) =>
					<Task
						className={`${classes.task} ${(!moveTasksOnDrag && task.id !== currentDraggedTaskID) ? classes.preventedDragMove : ''}`}
						taskObject={task}
						ref={provided.innerRef}
						{...provided.draggableProps}
						dragHandleProps={provided.dragHandleProps}
						onFullTaskOpen={handleModalOpen}
					/>
				}
			</Draggable>
		)

	return (
		<Container className={classes.container}>

			<Header className={classes.header} />
			
			<DragDropContext onDragStart={handleDragStart} onDragUpdate={handleDragUpdate} onDragEnd={handleDragEnd}>
				<div className={`${className} ${classes.table} ${isDragging ? classes.isDragging : ''}`}>
					
					{isLoading && <Loader className={classes.loader} />}
					{!!loadError && <LoadError className={classes.loadError} message={loadError} />}

					{taskGroups.map((group, index) =>
						<Droppable
							droppableId={group.status}
							key={index}
							renderClone={(provided) => (
								<div
									className={classes.taskClone}
									{...provided.draggableProps}
									{...provided.dragHandleProps}
									ref={provided.innerRef}
								>
									Drop it!
								</div>
							)}
						>
							{(provided) => (
								<div className={`${classes.cell} ${classes[group.status]} ${dragHoveredCell === group.status ? classes.isDragHover : ''}`} ref={provided.innerRef}>
									<div className={classes.cellTitle}>
										<p className={classes.cellTitleText}>{group.header}</p>
										<button
											className={`${classes.sortButton} ${group.isAscending ? classes.ascending : ''}`}
											onClick={changeGroupOrder}
											data-status={group.status}
										>
											<Icon name='icon-caret' />
										</button>
									</div>
									<div className={`${classes.tasks}`}>
										{getTaskElements(group.list)}
									</div>
									{provided.placeholder}
								</div>
							)}
						</Droppable>
					)}
				</div>
			</DragDropContext>

			<footer className={classes.footer}>
				<p className={classes.footerItem}>
					{`Project: ${currentProject?.name}`}
				</p>
				<p className={classes.footerItem}>
					{`Total tasks: ${tasks.length}`}
				</p>
				<p className={classes.footerItem}>
					{`empty`}
				</p>
			</footer>

			<Modal isActive={isModalActive} onClose={handleModalClose}>
				{currentTask && <FullTask taskObject={currentTask} />}
			</Modal>

		</Container>
	)
}
export default TodosTable



function getDraggableID(id: string | number) {
	return 'draggabletask_' + id
}
function parseDraggableID(fullId: string) {
	let id = fullId.split('_')[1]
	return isNaN(Number(id)) ? id : Number(id)
}
function getPriorityWeight(priority: TaskPriority) {
	switch(priority) {
		case TaskPriority.normal: return 0
		case TaskPriority.high: return 1
		case TaskPriority.top: return 2
	}
}


