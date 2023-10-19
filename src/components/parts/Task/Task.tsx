import { ComponentPropsWithRef, forwardRef, useState } from 'react';
import classes from './Task.module.scss';
import { ITask } from '../../../types/types';
import Icon from '../../ui/Icon/Icon';
import Subtasks from '../Subtasks/Subtasks';
import { useAppDispatch } from '../../../hooks/typedReduxHooks';
import ModalLink from '../../ui/Modal/ModalLink';
import FullTask from '../FullTask/FullTask';
import { DateService } from '../../../services/DateService';
import { DraggableProvidedDragHandleProps } from 'react-beautiful-dnd';

interface TaskProps extends ComponentPropsWithRef<'div'> {
	taskObject: ITask
	dragHandleProps?: DraggableProvidedDragHandleProps | null
}

const Task = forwardRef<HTMLDivElement, TaskProps>(function({
	taskObject: task,
	className = '',
	dragHandleProps,
	...props
}: TaskProps, ref) {

	const dispatch = useAppDispatch()
	let [isSubtasksVisible, setIsSubtasksVisible] = useState(true) // false
	function handleSubtaskSpoilerClick() {
		setIsSubtasksVisible(isSubtasksVisible ? false : true)
	}

	const priority = 'priority_' + task.priority
	// const comments = task.commentIds
	const attached = task.attached

	const remainingTime = DateService.getRemainingTime(task.createDate , task.expireDate)

	// DnD
	// /DnD


	return (
		<div className={`${className} ${classes.wrapper}`} {...props} ref={ref}>
			<div className={`${classes.priority} ${classes[priority]}`} {...dragHandleProps}></div>

			<ModalLink name='task-modal' content={<FullTask taskObject={task} />}>
				<p className={classes.title} title='edit task'>{task.title}</p>
			</ModalLink>
			<ModalLink name='task-modal' content={<FullTask taskObject={task} />}>
				<p className={classes.description} title='edit task'>{task.description}</p>
			</ModalLink>

			<div className={classes.taskDetails}>
				<div className={classes.detailsItem} title='comments'>
					<Icon className={classes.detailsIcon} name='icon-comment' />
					<span>C</span>
				</div>
				<div className={classes.detailsItem} title='attachments'>
					<Icon className={classes.detailsIcon} name='icon-file' />
					<span>0</span>
				</div>
				<div className={classes.detailsItem} title='time remaining'>
					<Icon className={classes.detailsIcon} name='icon-clock' />
					<span>{remainingTime}</span>
				</div>
			</div>
			<div className={classes.dragButton} {...dragHandleProps}>
				<Icon name='icon-drag' />
			</div>
			<button className={classes.spoilerButton} onClick={handleSubtaskSpoilerClick} title='subtasks'>
				<span className={classes.spoilerButtonIconBox}>
					<Icon name='icon-arrow-short' />
					{!!task.subtasks.length &&
						<span className={classes.bubble}>{task.subtasks.length}</span>
					}
				</span>
			</button>
			<Subtasks className={classes.subtasks} isVisible={isSubtasksVisible} parentId={task.id} />
		</div>
	)
})
export default Task