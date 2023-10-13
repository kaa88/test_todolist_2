import { ComponentProps, useState } from 'react';
import classes from './FullTask.module.scss';
import { ITask, TaskPriority, TaskStatus } from '../../../types/types';
import Icon from '../../ui/Icon/Icon';
import Subtasks from '../Subtasks/Subtasks';
import { useAppDispatch } from '../../../hooks/typedReduxHooks';
import InteractiveInput, { InteractiveInputCallback } from '../../ui/InteractiveInput/InteractiveInput';
import AutoResizeTextarea from '../../ui/AutoResizeTextarea/AutoResizeTextarea';
import { updateCurrentTask } from '../../../store/reducers/taskReducer';
import RadioButtons from '../../ui/RadioButtons/RadioButtons';

interface TaskProps extends ComponentProps<'div'> {
	taskObject: ITask
}

const FullTask = function({className = '', taskObject: task}: TaskProps) {


	const dispatch = useAppDispatch()
	const priority = 'priority_' + task.priority
	// const comments = task.commentIds
	const attached = task.attached

	let [title, setTitle] = useState(task.title)
	const updateTitle: InteractiveInputCallback = (value) => {
		value = value.toString()
		setTitle(value)
		dispatch(updateCurrentTask({...task, title: value}))
	}
	let [description, setDescription] = useState(task.description)
	const updateDescription: InteractiveInputCallback = (value) => {
		value = value.toString()
		setDescription(value)
		dispatch(updateCurrentTask({...task, description: value}))
	}


	const updateStatus = (value: TaskStatus) => {
		dispatch(updateCurrentTask({...task, status: value}))
	}
	const updatePriority = (value: TaskPriority) => {
		dispatch(updateCurrentTask({...task, priority: value}))
	}
	console.log(task.priority)

	return (
		<div className={`${className} ${classes.wrapper}`}>
			<div className={classes.textBlock}>
				<p className={classes.textBlockTitle}>Title:</p>
				<InteractiveInput value={title} confirmCallback={updateTitle}>
					<AutoResizeTextarea className={classes.taskTitle} />
				</InteractiveInput>
			</div>
			<div className={classes.textBlock}>
				<p className={classes.textBlockTitle}>Description:</p>
				<InteractiveInput value={description} confirmCallback={updateDescription}>
					<AutoResizeTextarea className={classes.taskDescription} />
				</InteractiveInput>
			</div>

			<div className={classes.taskDetails}>
				<div className="">createDate</div>
				<div className="">expireDate</div>
				<RadioButtons<TaskStatus>
					modif='status'
					buttons={statusRadioButtons}
					active={task.status}
					callback={updateStatus}
				/>
				<RadioButtons<TaskPriority>
					modif='priority'
					buttons={priorityRadioButtons}
					active={task.priority}
					callback={updatePriority}
				/>
			</div>
			<Subtasks className={classes.subtasks} isVisible={true} parentId={task.id} />
			<div className={classes.comments}>comments:</div>
			<div className="">attachments:</div>
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

