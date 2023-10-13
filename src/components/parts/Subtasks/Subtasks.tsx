import { ChangeEvent, ComponentProps, KeyboardEvent, useEffect, useState, forwardRef } from 'react';
import classes from './Subtasks.module.scss';
import Icon from '../../ui/Icon/Icon';
import { ISubtask, Id } from '../../../types/types';
import AutoResizeTextarea from '../../ui/AutoResizeTextarea/AutoResizeTextarea';
import { useAppDispatch, useAppSelector } from '../../../hooks/typedReduxHooks';
import { updateSubtasks } from '../../../store/reducers/taskReducer';
import InteractiveInput, { InteractiveInputCallback } from '../../ui/InteractiveInput/InteractiveInput';
import { DragDropContext, Droppable, Draggable, OnDragEndResponder } from 'react-beautiful-dnd';
import { log } from 'console';

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
		if (!destination) return; // dropped outside the list
		const newSubtasks = [...subtasks]
		const [removed] = newSubtasks.splice(source.index, 1)
		newSubtasks.splice(destination.index, 0, removed)
		dispatch(updateSubtasks({taskId: parentId, subtasks: newSubtasks}))
	}

	return (
		<div className={`${className} ${classes.wrapper} ${classes[stateClassName]}`}>
			<DragDropContext onDragEnd={handleDragEnd}>
				<Droppable droppableId={`subtaskOfTask_${parentId}`}>
					{(provided) => (
						<div className={classes.list} ref={provided.innerRef}>
							{subtasks.map(({title, isDone}, index) =>
								<Draggable
									draggableId={getDraggableID(index)} //?
									key={Date.now() + index}
									index={index}
								>
									{(provided, snapshot) =>
										<Subtask
											title={title}
											isDone={isDone}
											updateCallback={updateSubtask}
											deleteCallback={deleteSubtask}
											index={index}
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

	let [value, setValue] = useState<string | null>(null)

	const updateStatus = () => {
		let status = isDone ? false : true
		updateCallback(index, title, status)
	}
	const updateTitle: InteractiveInputCallback = (value) => {
		value = value.toString()
		setValue(null)
		updateCallback(index, value, isDone)
	}
	const deleteTask = () => {
		deleteCallback(index)
	}

	return (
		<div className={`${classes.subtask} ${isDone ? classes.status_done : ''}`} {...props} ref={ref}>
			<div className={classes.dragButton}>
				<Icon name='icon-drag' />
			</div>
			<button className={classes.notDraggableArea} onClick={()=>{}}></button>
			<button
				className={`${classes.subtaskStatusButton}`}
				onClick={updateStatus}
			>
				<Icon name='icon-ok' />
			</button>
			<InteractiveInput value={value === null ? title : value} confirmCallback={updateTitle}>
				<AutoResizeTextarea className={classes.subtaskTitle} wrapperClassName={classes.autoResizeTextareaWrapper} />
			</InteractiveInput>
			<button
				className={classes.deleteButton}
				onClick={deleteTask}
			>
				<Icon name='icon-cross' />
			</button>
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
				wrapperClassName={classes.autoResizeTextareaWrapper}
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


