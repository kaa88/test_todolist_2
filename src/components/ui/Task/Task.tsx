import { ComponentProps } from 'react';
import classes from './Task.module.scss';
import { ITask } from '../../../types/types';
import Icon from '../Icon/Icon';

interface TaskProps extends ComponentProps<'div'> {
	taskObject: ITask
}

const Task = function({taskObject: task, className = '', ...props}: TaskProps) {

	const priority = 'priority_' + task.priority
	console.log(priority)
	const subtasks = task.subtasks
	const comments = task.commentIds
	const attached = task.attached

	return (
		<div className={`${className} ${classes.default}`} {...props}>
			<div className={`${classes.priority} ${classes[priority]}`}>
				<Icon name='icon-warn' />
			</div>
			<p className={classes.title}>{task.title}</p>
			<p className={classes.description}>{task.description}</p>
			<p className={classes.time}>{task.expireDate}</p>
		</div>
	)
}
export default Task