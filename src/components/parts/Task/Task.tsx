import { ComponentPropsWithoutRef, forwardRef, useState } from 'react';
import classes from './Task.module.scss';
import { ITask } from '../../../types/types';
import Icon from '../../ui/Icon/Icon';
import Subtasks from '../Subtasks/Subtasks';
import { useAppDispatch } from '../../../hooks/typedReduxHooks';
import ModalLink from '../../ui/Modal/ModalLink';
import FullTask from '../FullTask/FullTask';
import { DateService } from '../../../services/DateService';
// import Modal from '../../ui/Modal/Modal';

interface TaskProps extends ComponentPropsWithoutRef<'div'> {
	taskObject: ITask
}

const Task = forwardRef<HTMLDivElement, TaskProps>(function({taskObject: task, className = '', ...props}: TaskProps, ref) {

	const dispatch = useAppDispatch()
	let [isSubtasksVisible, setIsSubtasksVisible] = useState(true) // false
	function handleSubtaskSpoilerClick() {
		setIsSubtasksVisible(isSubtasksVisible ? false : true)
	}

	const priority = 'priority_' + task.priority
	// const comments = task.commentIds
	const attached = task.attached

	const remainingTime = DateService.getRemainingTime(task.createDate , task.expireDate)

	// Modal link
	// const modalContent = <FullTask taskObject={task} />
	// let [isModalActive, setIsModalActive] = useState(false)
	// const openModal = () => {
	// 	setIsModalActive(true)
	// }
	// const closeModal = () => {
	// 	setIsModalActive(false)
	// }
	// /Modal link

	return (
		<div className={`${className} ${classes.wrapper}`} {...props} ref={ref}>
			<div className={`${classes.priority} ${classes[priority]}`}></div>

			<ModalLink name='task-modal' content={<FullTask taskObject={task} />}>
				<button className={classes.title}>{task.title}</button>
			</ModalLink>
			{/* <button className={classes.title} onClick={openModal}>{task.title}</button>
			<Modal onClose={closeModal}>
				{isModalActive ? modalContent : null}
			</Modal> */}


			<p className={classes.description}>{task.description}</p>
			<div className={classes.taskDetails}>
				<div className={classes.detailsItem} title='time'>
					<Icon className={classes.detailsIcon} name='icon-clock' />
					<span>{remainingTime}</span>
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
})
export default Task