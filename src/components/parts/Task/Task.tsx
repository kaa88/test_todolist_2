import { ComponentProps, useState } from 'react';
import classes from './Task.module.scss';
import { ITask } from '../../../types/types';
import Icon from '../../ui/Icon/Icon';
import Subtasks from '../Subtasks/Subtasks';
import { useAppDispatch } from '../../../hooks/typedReduxHooks';
import ModalLink from '../../ui/Modal/ModalLink';

interface TaskProps extends ComponentProps<'div'> {
	taskObject: ITask
}

const Task = function({taskObject: task, className = '', ...props}: TaskProps) {

	const dispatch = useAppDispatch()
	let [isSubtasksVisible, setIsSubtasksVisible] = useState(true) // false
	function handleSubtaskSpoilerClick() {
		setIsSubtasksVisible(isSubtasksVisible ? false : true)
	}

	const priority = 'priority_' + task.priority
	// const comments = task.commentIds
	const attached = task.attached


	return (
		<div className={`${className} ${classes.wrapper}`} {...props}>
			<div className={`${classes.priority} ${classes[priority]}`}></div>
			<ModalLink name='task-modal' content={<TaskModalContent taskObject={task} />}>
				<button className={classes.title}>{task.title}</button>
				{/* <p className={classes.title}>{task.title}</p> */}
			</ModalLink>
			<p className={classes.description}>{task.description}</p>
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
			<div className={classes.spoilerButton} onClick={handleSubtaskSpoilerClick}>
				<Icon name='icon-arrow-short' />
				<span className={classes.bubble}>{task.subtasks.length}</span>
			</div>
			<Subtasks className={classes.subtasks} isVisible={isSubtasksVisible} parentId={task.id} />
		</div>
	)
}
export default Task





const TaskModalContent = function({className = '', taskObject: task}: TaskProps) {


	const dispatch = useAppDispatch()
	const priority = 'priority_' + task.priority
	// const comments = task.commentIds
	const attached = task.attached


	return (
		<div className={`${className} ${classes.wrapper}`}>
			<div className={`${classes.priority} ${classes[priority]}`}>
				<Icon name='icon-warn' />
			</div>
			<ModalLink name='task-modal' content={<TaskModalContent taskObject={task} />}>
				<button className={classes.title}>{task.title}</button>
				{/* <p className={classes.title}>{task.title}</p> */}
			</ModalLink>
			<p className={classes.description}>{task.description}</p>
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
			<div className="">status (radio)</div>
			<div className="">createDate</div>
			<div className="">expireDate</div>
			<div className="">comments:</div>
			<div className="">attachments:</div>
		</div>
	)
}
