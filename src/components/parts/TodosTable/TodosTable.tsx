import { ComponentPropsWithoutRef, useEffect, useState, MouseEvent } from 'react';
import classes from './TodosTable.module.scss';
import Container from '../../ui/Container/Container';
import { ITask, TaskPriority, TaskSort, TaskStatus } from '../../../types/types';
import Task from '../Task/Task';
import { useAppDispatch, useAppSelector } from '../../../hooks/typedReduxHooks';
import { updateTask, updateTaskList } from '../../../store/reducers/taskReducer';
import { DragDropContext, Droppable, Draggable, OnDragEndResponder, OnDragUpdateResponder, OnDragStartResponder, DraggableProvided, DroppableProvided, OnBeforeCaptureResponder } from 'react-beautiful-dnd';
import LoadError from '../../ui/Loader/LoadError';
import Loader from '../../ui/Loader/Loader';
import Icon from '../../ui/Icon/Icon';
import { updateSettings } from '../../../store/reducers/userReducer';
import { Modal } from '../../ui/Modal/Modal';
import FullTask from '../FullTask/FullTask';
import Slider from '../../ui/Slider/Slider';
import { getCssVariable } from '../../../utilities/utilities';
import Footer from '../Footer/Footer';


interface TaskGroup {
	status: TaskStatus
	header: string
	list: ITask[]
	isAscending: boolean
}

export enum DraggableType {
	task = 'task',
	subtask = 'subtask'
}
export interface CurrentDraggedElement {
	id: number | string | null
	type: DraggableType | null
}

interface TodosTableProps extends ComponentPropsWithoutRef<'div'> {
	project: number
}


let mobileBreakpoint = 0


const TodosTable = function({project, className = ''}: TodosTableProps) {
	const dispatch = useAppDispatch()

	// Data
	let projects = useAppSelector(state => state.projects.list)
	const currentProject = projects.find(p => p.id === project)
	let {isLoading, loadError, list: tasks} = useAppSelector(state => state.tasks)
	useEffect(() => {
		dispatch(updateTaskList(project))
	}, [project])

	const userSettings = useAppSelector(state => state.user)
	const groupAscendingOrder = userSettings.taskGroupAscendingOrder || {}

	const taskGroups: TaskGroup[] = [
		{
			status: TaskStatus.queue,
			header: 'Queue',
			list: [],
			isAscending: groupAscendingOrder[TaskStatus.queue],
		},
		{
			status: TaskStatus.dev,
			header: 'Development',
			list: [],
			isAscending: groupAscendingOrder[TaskStatus.dev],
		},
		{
			status: TaskStatus.done,
			header: 'Done',
			list: [],
			isAscending: groupAscendingOrder[TaskStatus.done],
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
	// /Data

	
	// Data update
	const changeTaskStatus = (task: ITask, newStatus: string) => {
		if (Object.values(TaskStatus).includes(newStatus as TaskStatus))
			dispatch(updateTask({taskId: task.id, values: {status: newStatus as TaskStatus}}))
	}
	// /Data update


	// Modal
	let [currentTask, setCurrentTask] = useState<ITask | null>(null)
	let [isModalActive, setIsModalActive] = useState(false)
	const handleModalOpen = (taskObject: ITask) => {
		console.log('handleModalOpen')
		setCurrentTask(taskObject)
		setIsModalActive(true)
	}
	const handleModalClose = () => {
		setIsModalActive(false)
	}
	// /Modal


	// Viewport
	if (!mobileBreakpoint) mobileBreakpoint = getCssVariable('media-mobile')
	const checkIfMobileView = () => window.innerWidth <= mobileBreakpoint ? true : false
	const updateViewport = () => setIsMobileState(checkIfMobileView())
	let [isMobileState, setIsMobileState] = useState(checkIfMobileView())
	useEffect(() => {
		window.addEventListener('resize', updateViewport)
		return () => { window.removeEventListener('resize', updateViewport) }
	}, []) // eslint-disable-line react-hooks/exhaustive-deps
	// /Viewport


	// Slider
	const isSliderEnabled = isMobileState
	let [activeSlideIndex, setActiveSlideIndex] = useState(0)
	const handleSlideChange = (activeIndex: number) => {
		setActiveSlideIndex(activeIndex)
	}
	// /Slider


	// Drag & drop
	const moveTasksOnDrag = false
	const defaultCurrentDraggedElement = {id: null, type: null}
	let [currentDraggedElement, setCurrentDraggedElement] = useState<CurrentDraggedElement>(defaultCurrentDraggedElement)
	let [isDragging, setIsDragging] = useState(false)
	let [dragHoveredCell, setDragHoveredCell] = useState<TaskStatus | null>(null)
	const isTaskDragEnabled = !isSliderEnabled && currentDraggedElement.type !== DraggableType.subtask

	const handleBeforeCapture: OnBeforeCaptureResponder = (before) => {
		const draggable = parseDragDropID(before.draggableId)
		setCurrentDraggedElement(draggable)
	}
	const handleDragStart: OnDragStartResponder = (start) => {
		setIsDragging(true)
	}
	const handleDragUpdate: OnDragUpdateResponder = (update) => {
		const draggable = parseDragDropID(update.draggableId)
		if (draggable.type === DraggableType.subtask) return;
		const droppable = update.destination ? parseDragDropID(update.destination.droppableId) : defaultCurrentDraggedElement
		let newStatus = typeof droppable.id === 'string' ? droppable.id : null
		if (Object.values(TaskStatus).includes(newStatus as TaskStatus))
			setDragHoveredCell(newStatus as TaskStatus)
	}
	const handleDragEnd: OnDragEndResponder = (end) => { //{source, destination}
		setCurrentDraggedElement(defaultCurrentDraggedElement)
		setDragHoveredCell(null)
		setIsDragging(false)
		if (!end.destination) return; // dropped outside the list

		const draggable: CurrentDraggedElement = parseDragDropID(end.draggableId)
		const droppable: CurrentDraggedElement = parseDragDropID(end.destination.droppableId)
		if (!draggable || !droppable || draggable.type !== droppable.type) return;

		if (draggable.type === DraggableType.task) {
			if (end.source.droppableId !== end.destination.droppableId) {
				let prevDroppable = parseDragDropID(end.source.droppableId)
				let newDroppable = parseDragDropID(end.destination.droppableId)
				let group = taskGroups.find(gr => gr.status === prevDroppable.id)
				let currentTask = group?.list[end.source.index]
				let newStatus = typeof newDroppable.id === 'string' ? newDroppable.id : null
				if (currentTask && newStatus) changeTaskStatus(currentTask, newStatus)
			}
		}
		if (draggable.type === DraggableType.subtask) {
			if (end.source.droppableId === end.destination.droppableId) {
				const taskId = droppable.id
				const task = tasks.find(t => t.id === taskId)
				if (!task) return;
				const newSubtasks = [...task.subtasks]
				const [removed] = newSubtasks.splice(end.source.index, 1)
				newSubtasks.splice(end.destination.index, 0, removed)
				if (typeof taskId === 'number') dispatch(updateTask({taskId, values: {subtasks: newSubtasks}}))
			}
		}
	}
	// /Drag & drop


	const getCellElements = (taskGroups: TaskGroup[], isTaskDragEnabled: boolean) => (
		taskGroups.map((group, index) =>
			<Droppable
				droppableId={createDroppableID(group.status)}
				type={DraggableType.task}
				key={index}
			>
				{(provided) =>
					<div
						className={`${classes.cell} ${classes[group.status]} ${activeSlideIndex === index ? classes.activeSlideCell : ''} ${dragHoveredCell === group.status ? classes.isDragHover : ''}`}
						ref={provided.innerRef}
					>
						<div className={`${classes.tasks} ${isDragging ? classes.isDragging : ''}`}>
							{group.list.map((task, index) => {
								const uniqueId = createDraggableID(task.id)
								return (
									<Draggable
										draggableId={uniqueId}
										isDragDisabled={!isTaskDragEnabled}
										index={index}
										key={uniqueId}
									>
										{(provided) => {
											const preventedDragMoveClass = (
												isDragging
												&& !moveTasksOnDrag
												&& (currentDraggedElement.type === DraggableType.subtask
														|| (currentDraggedElement.type === DraggableType.task && task.id !== currentDraggedElement.id)
													)
											) ? classes.preventedDragMove : ''
											const hiddenClass = (
												isDragging
												&& currentDraggedElement.type === DraggableType.task
												&& task.id !== currentDraggedElement.id
											) ? classes.hidden : ''

											return <Task
												className={`${classes.task} ${preventedDragMoveClass} ${hiddenClass}`}
												taskObject={task}
												onFullTaskOpen={handleModalOpen}
												key={index}
												// dnd props:
												ref={provided.innerRef}
												{...provided.draggableProps}
												dragHandleProps={provided.dragHandleProps}
												currentDraggedElement={currentDraggedElement}
											/>
										}}
									</Draggable>
								)
							})}
						</div>
						{provided.placeholder}
					</div>
				}
			</Droppable>
		)
	)
	const getTableHeader = () => (
		taskGroups.map((group, index) =>
			<div className={`${classes.cellTitle} ${classes[group.status]} ${dragHoveredCell === group.status ? classes.isDragHover : ''}`} key={index}>
				<p className={classes.cellTitleText}>{group.header}</p>
				<button
					className={`${classes.sortButton} ${group.isAscending ? classes.ascending : ''}`}
					onClick={changeGroupOrder}
					data-status={group.status}
				>
					<Icon name='icon-caret' />
				</button>
			</div>
		)
	)

	
	return (
		<div className={classes.wrapper}>
			<Container className={classes.container}>

				<DragDropContext
					onBeforeCapture={handleBeforeCapture}
					onDragStart={handleDragStart}
					onDragUpdate={handleDragUpdate}
					onDragEnd={handleDragEnd}
				>
					<div className={`${className} ${classes.table} ${isDragging ? classes.isDragging : ''}`}>

						{isLoading && <Loader className={classes.loader} />}
						{!!loadError && <LoadError className={classes.loadError} message={loadError} />}

						{!isSliderEnabled
							?  <div className={classes.tableHeader}>
									{getTableHeader()}
								</div>
							:  <Slider
									className={classes.tableHeader}
									containerClassName='swiper-controller-header'
									controls='.swiper-controller-cells'
								>
									{getTableHeader()}
								</Slider>
						}

						<div className={classes.tableMain}>
							{!isSliderEnabled
								?  <div className={classes.cellsWrapper}>
										{getCellElements(taskGroups, isTaskDragEnabled)}
									</div>
								:  <Slider
										className={`${classes.cellsWrapper}`}
										containerClassName='swiper-controller-cells'
										controls='.swiper-controller-header'
										slideChageCallback={handleSlideChange}
									>
										{getCellElements(taskGroups, isTaskDragEnabled)}
									</Slider>
							}
						</div>

					</div>
				</DragDropContext>

				<Footer
					className={classes.footer}
					project={currentProject?.name}
					tasksCount={tasks.length}
				/>

			</Container>

			<Modal isActive={isModalActive} onClose={handleModalClose}>
				{currentTask && <FullTask taskObject={currentTask} />}
			</Modal>
		</div>
	)
}
export default TodosTable



function getPriorityWeight(priority: TaskPriority) {
	switch(priority) {
		case TaskPriority.normal: return 0
		case TaskPriority.high: return 1
		case TaskPriority.top: return 2
	}
}

function createDraggableID(id: string | number) {
	return `${DraggableType.task}_draggable_${id}`
}
function createDroppableID(id: string | number) {
	return `${DraggableType.task}_droppable_${id}`
}
export function parseDragDropID(fullId: string) {
	let split = fullId.split('_')
	let id: CurrentDraggedElement['id'] = split[split.length - 1]
	if (!id) id = null
	else {
		let num = Number(id)
		if (!isNaN(num)) id = num
	}
	let type: CurrentDraggedElement['type'] = null
	if (fullId.match(DraggableType.task)) type = DraggableType.task
	if (fullId.match(DraggableType.subtask)) type = DraggableType.subtask
	return { id, type }
}

