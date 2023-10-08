import { ChangeEvent, ComponentProps, KeyboardEvent, useEffect, useRef, useState } from 'react';
import classes from './Subtasks.module.scss';
import Icon from '../../ui/Icon/Icon';
import { ISubtask, Id } from '../../../types/types';
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
			<div className={classes.newSubtask}>
				<Icon className={classes.newSubtaskIcon} name='icon-at' />
				<AutoResizeTextarea
					className={classes.subtaskTitle}
					callback={createSubtask}
					isCreate={true}
				/>
			</div>
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
	title = '',
	isDone = false,
	updateCallback,
	deleteCallback,
	className = '',
	...props
}: SubtaskProps) {

	function updateStatus() {
		let status = isDone ? false : true
		updateCallback(index, title, status)
	}
	function updateValue(value: string) {
		if (value !== title) updateCallback(index, value, isDone)
	}
	function deleteTask() {
		deleteCallback(index)
	}

	return (
		<div className={classes.subtask} {...props}>
			<div
				className={`${classes.subtaskStatusButton} ${isDone ? classes.status_done : ''}`}
				onClick={updateStatus}
			>
				<Icon name='icon-ok' />
			</div>
			<AutoResizeTextarea
				className={classes.subtaskTitle}
				content={title}
				callback={updateValue}
			/>
			<div className={classes.deleteButton} onClick={deleteTask}>
				<Icon name='icon-cross' />
			</div>
		</div>
	)
}