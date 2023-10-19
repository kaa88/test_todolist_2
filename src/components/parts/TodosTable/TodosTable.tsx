import { ComponentPropsWithoutRef, useEffect, useState } from 'react';
import classes from './TodosTable.module.scss';
import Container from '../../ui/Container/Container';
import { ITask, Id, TaskStatus } from '../../../types/types';
import Task from '../Task/Task';
import { useAppDispatch, useAppSelector } from '../../../hooks/typedReduxHooks';
import { updateCurrentTask, updateTaskList } from '../../../store/reducers/taskReducer';
import { DragDropContext, Droppable, Draggable, OnDragEndResponder, OnDragUpdateResponder, OnDragStartResponder } from 'react-beautiful-dnd';
import LoadError from '../../ui/Loader/LoadError';
import Loader from '../../ui/Loader/Loader';
import Icon from '../../ui/Icon/Icon';
import Header from '../Header/Header';

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

	const taskGroups: {status: TaskStatus, header: string, list: ITask[]}[] = [
		{
			status: TaskStatus.queue,
			header: 'Queue',
			list: []
		},
		{
			status: TaskStatus.dev,
			header: 'Development',
			list: []
		},
		{
			status: TaskStatus.done,
			header: 'Done',
			list: []
		},
	]
	tasks.forEach(task => {
		let group = taskGroups.find(gr => gr.status === task.status)
		group?.list.push(task)
	})
	// console.log(taskGroups)
	// console.log(tasks)

	const moveTasksOnDrag = false
	
	let [currentDraggedTaskID, setCurrentDraggedTaskID] = useState<Id | null>(null)
	let [isDragging, setIsDragging] = useState(false)
	let [dragHoveredCell, setDragHoveredCell] = useState<TaskStatus | null>(null)

	const changeTaskStatus = (task: ITask, newStatus: TaskStatus) => {
		dispatch(updateCurrentTask({...task, status: newStatus}))
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
									<p className={classes.cellTitle}>{group.header}</p>
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


