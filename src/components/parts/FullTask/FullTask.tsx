import { ComponentProps, useState, memo } from 'react';
import classes from './FullTask.module.scss';
import { ITask, TaskPriority, TaskStatus } from '../../../types/types';
import Subtasks from '../Subtasks/Subtasks';
import { useAppDispatch, useAppSelector } from '../../../hooks/typedReduxHooks';
import InteractiveInput, { InteractiveInputCallback } from '../../ui/InteractiveInput/InteractiveInput';
import AutoResizeTextarea from '../../ui/AutoResizeTextarea/AutoResizeTextarea';
import { deleteTask, updateTask } from '../../../store/reducers/taskReducer';
import RadioButtons from '../../ui/RadioButtons/RadioButtons';
import TaskTime, { Dates } from '../TaskTime/TaskTime';
import Comments from '../Comments/Comments';
import { closeAllModals } from '../../../store/reducers/modalReducer';
import { Link } from 'react-router-dom';
import Button from '../../ui/Button/Button';
import { updateProjectTaskCount } from '../../../store/reducers/projectReducer';
import Attachments from '../Attachments/Attachments';

interface TaskProps extends ComponentProps<'div'> {
	taskObject: ITask
}

const FullTask = memo(function({className = '', taskObject: task}: TaskProps) {
	const dispatch = useAppDispatch()

	let [title, setTitle] = useState(task.title)
	let [isTitleError, setIsTitleError] = useState(false)
	const updateTitle: InteractiveInputCallback = (value) => {
		if (!value) return setIsTitleError(true)
		value = value.toString()
		setTitle(value)
		setIsTitleError(false)
		if (task) dispatch(updateTask({taskId: task.id, values: {title: value}}))
	}
	let [description, setDescription] = useState(task.description)
	const updateDescription: InteractiveInputCallback = (value) => {
		value = value.toString()
		setDescription(value)
		if (task) dispatch(updateTask({taskId: task.id, values: {description: value}}))
	}

	const updateStatus = (value: TaskStatus) => {
		if (task) dispatch(updateTask({taskId: task.id, values: {status: value}}))
	}
	const updatePriority = (value: TaskPriority) => {
		if (task) dispatch(updateTask({taskId: task.id, values: {priority: value}}))
	}

	let [dates, setDates] = useState<Dates>({create: task.createDate, expire: task.expireDate})
	const updateDates = function(dates: Dates) {
		setDates(dates)
		if (task) dispatch(updateTask({taskId: task.id, values: {expireDate: dates.expire}}))
	}

	const deleteCurrentTask = () => {
		let confirm = window.confirm('Are you sure you want to delete this task?')
		if (confirm) {
			dispatch(deleteTask(task))
			dispatch(updateProjectTaskCount({projectId: task.projectId, decrement: true}))
			dispatch(closeAllModals())
		}
	}

	const projects = useAppSelector(state => state.projects.list)
	const currentProject = projects.find(p => p.id === task.projectId)
	const currentProjectName = currentProject?.name || ''

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

			<div className={classes.info}>
				<div className={classes.infoId}>{`ID: ${task.id}`}</div>
				<div className={classes.infoProject}>
					<span>Project: </span>
					<Link className={classes.projectLink} to={'/project/' + task.projectId}>{currentProjectName}</Link>
				</div>
			</div>

			<div className={classes.taskDetails}>
				<div className={classes.taskDetailsContainer}>
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
			</div>
			<Subtasks className={classes.subtasks} isFulltask={true} parentId={task.id} />
			<div className={classes.attachments}>
				<Attachments taskId={task.id} />
			</div>
			<div className={classes.deleteWrapper}>
				<Button className={classes.deleteTaskButton} onClick={deleteCurrentTask}>
					Delete task
				</Button>
			</div>
			<Comments className={classes.comments} taskId={task.id} />
		</div>
	)
})
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

