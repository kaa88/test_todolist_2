import { ChangeEvent, ComponentProps, KeyboardEvent, useEffect, useRef, useState } from 'react';
import classes from './Subtasks.module.scss';
import Icon from '../../ui/Icon/Icon';
import { ISubtask } from '../../../types/types';
import AutoResizeTextarea from '../../ui/AutoResizeTextarea/AutoResizeTextarea';

interface SubtasksProps extends ComponentProps<'div'> {
	isVisible: boolean
	list?: ISubtask[]
}

interface SubtaskCallbackProps {
	index?: number
	title?: string
	isDone?: boolean
	delete?: boolean
}

const Subtasks = function({isVisible, list: subtasks = [], className = ''}: SubtasksProps) {

	const stateClassName = isVisible ? 'visible' : 'hidden'

	function subtaskCallback(props: SubtaskCallbackProps) {
		console.log(props.index, props.title, props.isDone, props.delete)
		// if (props.delete)
	}

	function createTask(value: string) {
		console.log(value)
	}

	return (
		<div className={`${className} ${classes.wrapper} ${classes[stateClassName]}`}>
			<div className={classes.list}>
				{subtasks.map(({title, isDone}, index) =>
					<Subtask title={title} isDone={isDone} callback={subtaskCallback} key={index} index={index} />
				)}
			</div>
			<div className={classes.newSubtask}>
				<Icon className={classes.newSubtaskIcon} name='icon-at' />
				<AutoResizeTextarea
					className={classes.subtaskTitle}
					callback={createTask}
					isCreate={true}
				/>
			</div>
		</div>
	)
}
export default Subtasks





interface SubtaskProps extends ComponentProps<'div'> {
	title: string
	isDone?: boolean
	callback: (props: SubtaskCallbackProps) => void
	index?: number
}

const Subtask = function({title = '', isDone = false, callback, index, className = '', ...props}: SubtaskProps) {

	function updateStatus() {
		let status = isDone ? false : true
		callback({index, isDone: status})
	}
	function updateTask(value: string) {
		if (value !== title) callback({index, title: value})
	}
	function deleteTask() {
		callback({index, delete: true})
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
				callback={updateTask}
			/>
			<div className={classes.deleteButton} onClick={deleteTask}>
				<Icon name='icon-cross' />
			</div>
		</div>
	)
}