import { ComponentProps, useState } from 'react';
import classes from './Task.module.scss';
import { ITask } from '../../../types/types';
import Icon from '../../ui/Icon/Icon';
import Subtasks from '../Subtasks/Subtasks';
import { useAppDispatch } from '../../../hooks/typedReduxHooks';
import { updateSubtasks } from '../../../store/reducers/taskReducer';

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
	// console.log(priority)
	const subtasks = task.subtasks
	// const comments = task.commentIds
	const attached = task.attached

	function updateSubs() {
		dispatch(updateSubtasks({taskId: task.id, subtasks}))
	}

	return (
		<div className={`${className} ${classes.wrapper}`} {...props} title={task.description}>
			<div className={`${classes.priority} ${classes[priority]}`}></div>
			<p className={classes.title}>{task.title}</p>
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
				<span className={classes.bubble}>1</span>
			</div>
			<Subtasks className={classes.subtasks} isVisible={isSubtasksVisible} parentId={task.id} />
		</div>
	)
}
export default Task
