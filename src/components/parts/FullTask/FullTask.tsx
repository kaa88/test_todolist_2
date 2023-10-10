import { ComponentProps, useState } from 'react';
import classes from './FullTask.module.scss';
import { ITask, TaskStatus } from '../../../types/types';
import Icon from '../../ui/Icon/Icon';
import Subtasks from '../Subtasks/Subtasks';
import { useAppDispatch } from '../../../hooks/typedReduxHooks';
import InteractiveInput, { InteractiveInputCallback } from '../../ui/InteractiveInput/InteractiveInput';
import AutoResizeTextarea from '../../ui/AutoResizeTextarea/AutoResizeTextarea';
import { updateCurrentTask } from '../../../store/reducers/taskReducer';
import StatusRadio from '../../ui/StatusRadio/StatusRadio';

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
	// let [status, setStatus] = useState(task.status)
	const updateStatus = (value: TaskStatus) => {
		dispatch(updateCurrentTask({...task, status: value}))
	}

	return (
		<div className={`${className} ${classes.wrapper}`}>
			<div className={`${classes.priority} ${classes[priority]}`}>
				<Icon name='icon-warn' />
			</div>

			<InteractiveInput value={title} confirmCallback={updateTitle}>
				<AutoResizeTextarea className={classes.title} />
			</InteractiveInput>

			<InteractiveInput value={description} confirmCallback={updateDescription}>
				<AutoResizeTextarea className={classes.description} />
			</InteractiveInput>

			<div className={classes.taskDetails}>
				<div className={classes.detailsItem} title='time'>
					<Icon className={classes.detailsIcon} name='icon-clock' />
					<span>{task.expireDate}</span>
				</div>
				<div className={classes.detailsItem} title='comments'>
					<Icon className={classes.detailsIcon} name='icon-clock' />
					<span>c</span>
				</div>
				<div className={classes.detailsItem} title='attach'>
					<Icon className={classes.detailsIcon} name='icon-clock' />
					<span>a</span>
				</div>
			</div>
			<Subtasks className={classes.subtasks} isVisible={true} parentId={task.id} />
			<div className="">
				<StatusRadio task={task} callback={updateStatus} />
			</div>
			<div className="">createDate</div>
			<div className="">expireDate</div>
			<div className="">comments:</div>
			<div className="">attachments:</div>
		</div>
	)
}
export default FullTask