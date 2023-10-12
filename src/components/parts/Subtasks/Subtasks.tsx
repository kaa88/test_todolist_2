import { ChangeEvent, ComponentProps, KeyboardEvent, useEffect, useState, forwardRef } from 'react';
import classes from './Subtasks.module.scss';
import Icon from '../../ui/Icon/Icon';
import { Id } from '../../../types/types';
import AutoResizeTextarea from '../../ui/AutoResizeTextarea/AutoResizeTextarea';
import { useAppDispatch, useAppSelector } from '../../../hooks/typedReduxHooks';
import { updateSubtasks } from '../../../store/reducers/taskReducer';
import InteractiveInput, { InteractiveInputCallback } from '../../ui/InteractiveInput/InteractiveInput';
import { DragDropContext, Droppable, Draggable, OnDragEndResponder } from 'react-beautiful-dnd';

interface SubtasksProps extends ComponentProps<'div'> {
	isVisible: boolean
	parentId: Id
}
type UpdateSubtaskFunction = (id: Id, title: string, isDone: boolean) => void
type CreateSubtaskFunction = (title: string) => void
type DeleteSubtaskFunction = (id: Id) => void


const Subtasks = function({isVisible, parentId, className = ''}: SubtasksProps) {

	const stateClassName = isVisible ? 'visible' : 'hidden'

	const dispatch = useAppDispatch()
	const taskList = useAppSelector(state => state.tasks.list)
	const parentTask = taskList.find(task => task.id === parentId)
	let subtasks = parentTask ? parentTask.subtasks : []
	
	const updateSubtask: UpdateSubtaskFunction = (id, title, isDone) => {
		let newSubtasks = [...subtasks]
		newSubtasks[id].title = title
		newSubtasks[id].isDone = isDone
		dispatch(updateSubtasks({taskId: parentId, subtasks: newSubtasks}))
	}
	const createSubtask: CreateSubtaskFunction = (title) => {
		let newSubtasks = [...subtasks]
		let newSub = {title, isDone: false}
		newSubtasks.push(newSub)
		dispatch(updateSubtasks({taskId: parentId, subtasks: newSubtasks}))
	}
	const deleteSubtask: DeleteSubtaskFunction = (id) => {
		let newSubtasks = [...subtasks]
		newSubtasks.splice(id, 1)
		dispatch(updateSubtasks({taskId: parentId, subtasks: newSubtasks}))
	}

	const handleDragEnd: OnDragEndResponder = ({source, destination}) => {
		// setIsDragging(false)
		// setCurrentDraggedTaskID(null)
		// if (!destination) return; // dropped outside the list
		// if (source.droppableId === destination.droppableId) {
		// 	return;
		// } else {
		// 	let prevStatus = source.droppableId as TaskStatus
		// 	let newStatus = destination.droppableId as TaskStatus
		// 	let droppableIndex = source.index
		// 	let group = taskGroups.find(gr => gr.status === prevStatus)
		// 	let currentTask = group?.list[droppableIndex]
		// 	if (currentTask) changeTaskStatus(currentTask, newStatus)
		// }
	}

	return (
		<div className={`${className} ${classes.wrapper} ${classes[stateClassName]}`}>
			<DragDropContext onDragEnd={handleDragEnd}>
				<Droppable droppableId={`subtaskOfTask_${parentId}`}>
					{(provided) => (
						<div className={classes.list}>
							{subtasks.map(({title, isDone}, index) =>
								<Draggable
									draggableId={getDraggableID(index)} //?
									key={index}
									index={index}
								>
									{(provided, snapshot) =>
										<Subtask
											title={title}
											isDone={isDone}
											updateCallback={updateSubtask}
											deleteCallback={deleteSubtask}
											index={index}
											key={index}
											ref={provided.innerRef}
											{...provided.draggableProps}
											{...provided.dragHandleProps}
										/>
									}
								</Draggable>
							)}
							{provided.placeholder}
						</div>
					)}
				</Droppable>
				</DragDropContext>
			<NewSubtask createCallback={createSubtask} />
		</div>
	)
}
export default Subtasks





interface SubtaskProps extends ComponentProps<'div'> {
	index: number
	title: string
	isDone?: boolean
	updateCallback: UpdateSubtaskFunction
	deleteCallback: DeleteSubtaskFunction
}

const Subtask = forwardRef<HTMLDivElement, SubtaskProps>(function({
	index,
	title,
	isDone = false,
	updateCallback,
	deleteCallback,
	className = '',
	...props
}: SubtaskProps, ref) {

	let [value, setValue] = useState(title)

	const updateStatus = () => {
		let status = isDone ? false : true
		updateCallback(index, title, status)
	}
	const updateTitle: InteractiveInputCallback = (value) => {
		value = value.toString()
		setValue(value)
		updateCallback(index, value, isDone)
	}
	const deleteTask = () => {
		deleteCallback(index)
	}

	return (
		<div className={classes.subtask} {...props} ref={ref}>
			<button
				className={`${classes.subtaskStatusButton} ${isDone ? classes.status_done : ''}`}
				onClick={updateStatus}
			>
				<Icon name='icon-ok' />
			</button>
			<InteractiveInput value={value} confirmCallback={updateTitle}>
				<AutoResizeTextarea className={classes.subtaskTitle} />
			</InteractiveInput>
			<button
				className={classes.deleteButton}
				onClick={deleteTask}
			>
				<Icon name='icon-cross' />
			</button>
			<div className={classes.dragButton}>
				<Icon name='icon-drag' />
			</div>
		</div>
	)
})





interface NewSubtaskProps extends ComponentProps<'div'> {
	createCallback: CreateSubtaskFunction
}

const NewSubtask = function({ createCallback, className = '', ...props }: NewSubtaskProps) {

	const defaultValue = ''

	let [value, setValue] = useState(defaultValue)
	let [isComfirm, setIsConfirm] = useState(false)

	function confirmUpdate() {
		setIsConfirm(true)
	}
	function handleChange(e: ChangeEvent<HTMLTextAreaElement>) {
		setValue(e.target.value)
	}
	function handleKeyDown(e: KeyboardEvent<HTMLTextAreaElement>) {
		if (e.key === 'Enter' && !e.shiftKey) {
			e.preventDefault()
			if (value !== defaultValue) confirmUpdate()
		}
		if (e.key === 'Escape') {
			setValue(defaultValue)
			e.currentTarget.blur()
		}
	}
	useEffect(() => {
		if (isComfirm) {
			let trimmedValue = value.trimEnd()
			if (trimmedValue !== defaultValue) createCallback(trimmedValue)
			setValue(defaultValue)
			setIsConfirm(false)
		}
	}, [isComfirm])

	return (
		<div className={`${className} ${classes.newSubtask}`} {...props}>
			<div className={classes.newSubtaskIcon}>
				<Icon name='icon-cross-bold' />
			</div>
			<AutoResizeTextarea
				className={classes.subtaskTitle}
				value={value}
				onChange={handleChange}
				onKeyDown={handleKeyDown}
			/>
			<button
				className={classes.confirmButton}
				onClick={confirmUpdate}
				disabled={value === defaultValue ? true : false}
			>
				<Icon name='icon-ok' />
			</button>
		</div>
	)
}


function getDraggableID(id: string | number) {
	return 'draggableSubtask_' + id
}
function parseDraggableID(fullId: string) {
	let id = fullId.split('_')[1]
	return isNaN(Number(id)) ? id : Number(id)
}





