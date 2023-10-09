import { ChangeEvent, ComponentProps, KeyboardEvent, useEffect, useState } from 'react';
import classes from './Subtasks.module.scss';
import Icon from '../../ui/Icon/Icon';
import { Id } from '../../../types/types';
import AutoResizeTextarea from '../../ui/AutoResizeTextarea/AutoResizeTextarea';
import { useAppDispatch, useAppSelector } from '../../../hooks/typedReduxHooks';
import { updateSubtasks } from '../../../store/reducers/taskReducer';

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
	const taskList = useAppSelector(state => state.task.list)
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

	return (
		<div className={`${className} ${classes.wrapper} ${classes[stateClassName]}`}>
			<div className={classes.list}>
				{subtasks.map(({title, isDone}, index) =>
					<Subtask
						title={title}
						isDone={isDone}
						updateCallback={updateSubtask}
						deleteCallback={deleteSubtask}
						index={index}
						key={index}
					/>
				)}
			</div>
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

const Subtask = function({
	index,
	title,
	isDone = false,
	updateCallback,
	deleteCallback,
	className = '',
	...props
}: SubtaskProps) {

	let [value, setValue] = useState(title)
	let [isComfirm, setIsConfirm] = useState(false)

	function updateStatus() {
		let status = isDone ? false : true
		updateCallback(index, title, status)
	}
	function deleteTask() {
		deleteCallback(index)
	}
	function handleChange(e: ChangeEvent<HTMLTextAreaElement>) {
		setValue(e.target.value)
	}
	function handleKeyDown(e: KeyboardEvent<HTMLTextAreaElement>) {
		if (e.key === 'Enter') {
			e.preventDefault()
			if (value !== title) {
				setIsConfirm(true)
				e.currentTarget.blur()
			}
		}
		if (e.key === 'Escape') {
			setValue(title)
			e.currentTarget.blur()
		}
	}
	function handleBlur() {
		if (value !== title) setIsConfirm(true)
	}
	useEffect(() => {
		if (isComfirm) {
			let trimmedValue = value.trimEnd()
			if (trimmedValue !== title) updateCallback(index, trimmedValue, isDone)
			setValue(trimmedValue)
			setIsConfirm(false)
		}
	}, [isComfirm])

	return (
		<div className={classes.subtask} {...props}>
			<button
				className={`${classes.subtaskStatusButton} ${isDone ? classes.status_done : ''}`}
				onClick={updateStatus}
			>
				<Icon name='icon-ok' />
			</button>
			<AutoResizeTextarea
				className={classes.subtaskTitle}
				value={value}
				onChange={handleChange}
				onKeyDown={handleKeyDown}
				onBlur={handleBlur}
			/>
			<button
				className={classes.deleteButton}
				onClick={deleteTask}
			>
				<Icon name='icon-cross' />
			</button>
		</div>
	)
}





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
		if (e.key === 'Enter') {
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