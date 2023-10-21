import { ComponentProps, useState } from 'react';
import classes from './FullTask.module.scss';
import { ITask, TaskPriority, TaskStatus } from '../../../types/types';
import Subtasks from '../Subtasks/Subtasks';
import { useAppDispatch } from '../../../hooks/typedReduxHooks';
import InteractiveInput, { InteractiveInputCallback } from '../../ui/InteractiveInput/InteractiveInput';
import AutoResizeTextarea from '../../ui/AutoResizeTextarea/AutoResizeTextarea';
import { deleteTask, updateCurrentTask } from '../../../store/reducers/taskReducer';
import RadioButtons from '../../ui/RadioButtons/RadioButtons';
import TaskTime, { Dates } from '../TaskTime/TaskTime';
import Comments from '../Comments/Comments';
import { closeAllModals } from '../../../store/reducers/modalReducer';

interface TaskProps extends ComponentProps<'div'> {
	taskObject: ITask
}

const FullTask = function({className = '', taskObject: task}: TaskProps) {
	const dispatch = useAppDispatch()

	// const priority = 'priority_' + task.priority
	// const comments = task.commentIds
	// const attached = task.attached


	let [title, setTitle] = useState(task.title)
	let [isTitleError, setIsTitleError] = useState(false)
	const updateTitle: InteractiveInputCallback = (value) => {
		if (!value) return setIsTitleError(true)
		value = value.toString()
		setTitle(value)
		setIsTitleError(false)
		if (task) dispatch(updateCurrentTask({...task, title: value}))
	}
	let [description, setDescription] = useState(task.description)
	const updateDescription: InteractiveInputCallback = (value) => {
		value = value.toString()
		setDescription(value)
		if (task) dispatch(updateCurrentTask({...task, description: value}))
	}

	const updateStatus = (value: TaskStatus) => {
		if (task) dispatch(updateCurrentTask({...task, status: value}))
	}
	const updatePriority = (value: TaskPriority) => {
		if (task) dispatch(updateCurrentTask({...task, priority: value}))
	}

	let [dates, setDates] = useState<Dates>({create: task.createDate, expire: task.expireDate})
	const updateDates = function(dates: Dates) {
		setDates(dates)
		if (task) dispatch(updateCurrentTask({...task, createDate: dates.create, expireDate: dates.expire}))
	}

	const deleteCurrentTask = () => {
		let confirm = window.confirm('Are you sure you want to delete this task?')
		if (confirm) {
			dispatch(deleteTask(task))
			dispatch(closeAllModals())
		}
	}

	return (
		<div className={`${className} ${classes.wrapper}`}>
			<div className={classes.textBlock}>
				<p className={classes.blockTitle}>Title:</p>
				<InteractiveInput value={title} confirmCallback={updateTitle}>
					<AutoResizeTextarea className={`${classes.taskTitle} ${isTitleError ? classes.inputError : ''}`} />
				</InteractiveInput>
			</div>
			<div className={classes.textBlock}>
				<p className={classes.blockTitle}>Description:</p>
				<InteractiveInput value={description} confirmCallback={updateDescription}>
					<AutoResizeTextarea className={classes.taskDescription} />
				</InteractiveInput>
			</div>

			<div className={classes.taskDetails}>
				<TaskTime
					className={classes.dateTime}
					dates={dates}
					callback={updateDates}
				/>
				<div className={classes.radioButtonsWrapper}>
					<p className={classes.blockTitle}>Priority:</p>
					<RadioButtons<TaskPriority>
						className={classes.radioButtons}
						modif='priority'
						buttons={priorityRadioButtons}
						active={task.priority}
						callback={updatePriority}
					/>
				</div>
				<div className={classes.radioButtonsWrapper}>
					<p className={classes.blockTitle}>Status:</p>
					<RadioButtons<TaskStatus>
						className={classes.radioButtons}
						modif='status'
						buttons={statusRadioButtons}
						active={task.status}
						callback={updateStatus}
					/>
				</div>
			</div>
			<Subtasks className={classes.subtasks} parentId={task.id} />
			<button className={classes.deleteTaskButton} onClick={deleteCurrentTask}>
				Delete task
			</button>
			<div className={classes.attachments}>
				<p className={classes.blockTitle}>Attachments:</p>
			</div>
			<Comments className={classes.comments} taskId={task.id} />
		</div>
	)
}
export default FullTask


export interface RadioButtonsContent<T> {
	id: T
	textContent: string
}
const statusRadioButtons: RadioButtonsContent<TaskStatus>[] = [
	{
		id: TaskStatus.queue,
		textContent: 'Queue',
	},
	{
		id: TaskStatus.dev,
		textContent: 'Development',
	},
	{
		id: TaskStatus.done,
		textContent: 'Done',
	}
]
const priorityRadioButtons: RadioButtonsContent<TaskPriority>[] = [
	{
		id: TaskPriority.normal,
		textContent: 'Normal',
	},
	{
		id: TaskPriority.high,
		textContent: 'High',
	},
	{
		id: TaskPriority.top,
		textContent: 'Top',
	}
]

