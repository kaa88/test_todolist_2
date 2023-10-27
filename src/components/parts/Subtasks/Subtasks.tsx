import { ChangeEvent, ComponentProps, KeyboardEvent, useEffect, useState, forwardRef, memo } from 'react';
import classes from './Subtasks.module.scss';
import Icon from '../../ui/Icon/Icon';
import { Id } from '../../../types/types';
import { DragDropContext, Droppable, Draggable, OnDragEndResponder, DraggableProvidedDragHandleProps, OnDragStartResponder } from 'react-beautiful-dnd';
import { useAppDispatch, useAppSelector } from '../../../hooks/typedReduxHooks';
import { updateTask } from '../../../store/reducers/taskReducer';
import InteractiveInput, { InteractiveInputCallback } from '../../ui/InteractiveInput/InteractiveInput';
import AutoResizeTextarea from '../../ui/AutoResizeTextarea/AutoResizeTextarea';

interface SubtasksProps extends ComponentProps<'div'> {
	parentId: Id
}
type UpdateSubtaskFunction = (id: Id, title: string, isDone: boolean) => void
type CreateSubtaskFunction = (title: string) => void
type DeleteSubtaskFunction = (id: Id) => void

const noSwipingClass = 'swiper-no-swiping'

const Subtasks = memo(forwardRef<HTMLDivElement, SubtasksProps>(function({parentId, className = ''}: SubtasksProps, ref) {

	const dispatch = useAppDispatch()
	const taskList = useAppSelector(state => state.tasks.list)
	const parentTask = taskList.find(task => task.id === parentId)
	let subtasks = parentTask ? parentTask.subtasks : []
	
	const updateSubtask: UpdateSubtaskFunction = (id, title, isDone) => {
		let newSubtasks = [...subtasks]
		newSubtasks[id].title = title
		newSubtasks[id].isDone = isDone
		dispatch(updateTask({taskId: parentId, values: {subtasks: newSubtasks}}))
	}
	const createSubtask: CreateSubtaskFunction = (title) => {
		let newSubtasks = [...subtasks]
		let newSub = {id: Date.now(), title, isDone: false}
		newSubtasks.push(newSub)
		dispatch(updateTask({taskId: parentId, values: {subtasks: newSubtasks}}))
	}
	const deleteSubtask: DeleteSubtaskFunction = (id) => {
		let newSubtasks = [...subtasks]
		newSubtasks.splice(id, 1)
		dispatch(updateTask({taskId: parentId, values: {subtasks: newSubtasks}}))
	}

	let [currentDraggedTaskID, setCurrentDraggedTaskID] = useState<Id | null>(null)

	const handleDragStart: OnDragStartResponder = (start) => {
		let id = parseDraggableID(start.draggableId)
		setCurrentDraggedTaskID(typeof id === 'number' ? id : null)
	}
	const handleDragEnd: OnDragEndResponder = ({source, destination}) => {
		setCurrentDraggedTaskID(null)
		if (!destination) return; // dropped outside the list
		const newSubtasks = [...subtasks]
		const [removed] = newSubtasks.splice(source.index, 1)
		newSubtasks.splice(destination.index, 0, removed)
		dispatch(updateTask({taskId: parentId, values: {subtasks: newSubtasks}}))
	}

	return (
		<div className={`${className} ${classes.wrapper}`} ref={ref}>
			<DragDropContext onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
				<Droppable droppableId={`subtaskOfTask${parentId}`}>
					{(provided) => (
						<div className={classes.list} ref={provided.innerRef}>
							{subtasks.map(({id, title, isDone}, index) =>
								<Draggable
									draggableId={getDraggableID(id)}
									key={id}
									index={index}
								>
									{(provided) =>
										<Subtask
											className={`${currentDraggedTaskID === id ? classes.currentDragging : ''}`}
											title={title}
											isDone={isDone}
											updateCallback={updateSubtask}
											deleteCallback={deleteSubtask}
											index={index}
											ref={provided.innerRef}
											{...provided.draggableProps}
											dragHandleProps={provided.dragHandleProps}
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
}))
export default Subtasks





interface SubtaskProps extends ComponentProps<'div'> {
	index: number
	title: string
	isDone?: boolean
	updateCallback: UpdateSubtaskFunction
	deleteCallback: DeleteSubtaskFunction
	dragHandleProps?: DraggableProvidedDragHandleProps | null
}

const Subtask = forwardRef<HTMLDivElement, SubtaskProps>(function({
	index,
	title,
	isDone = false,
	updateCallback,
	deleteCallback,
	className = '',
	dragHandleProps,
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
		<div className={`${className} ${classes.subtask} ${isDone ? classes.status_done : ''} ${noSwipingClass}`} {...props} ref={ref}>
			<div className={classes.dragButton} {...dragHandleProps}>
				<Icon name='icon-drag' />
			</div>
			<button
				className={`${classes.subtaskStatusButton}`}
				onClick={updateStatus}
			>
				<Icon name='icon-ok' />
			</button>
			<InteractiveInput value={value === null ? title : value} confirmCallback={updateTitle}>
				<AutoResizeTextarea className={`${classes.subtaskTitle} ${noSwipingClass}`} wrapperClassName={classes.autoResizeTextareaWrapper} />
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
		<div className={`${className} ${classes.newSubtask} ${noSwipingClass}`} {...props}>
			<div className={classes.newSubtaskIcon}>
				<Icon name='icon-cross-bold' />
			</div>
			<AutoResizeTextarea
				className={classes.subtaskTitle}
				wrapperClassName={classes.autoResizeTextareaWrapper}
				value={value}
				placeholder='Add subtask'
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


