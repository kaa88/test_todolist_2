import { ComponentPropsWithRef, forwardRef, useEffect, useRef, useState } from 'react';
import classes from './Task.module.scss';
import { ITask } from '../../../types/types';
import Icon from '../../ui/Icon/Icon';
import Subtasks from '../Subtasks/Subtasks';
import { useAppDispatch } from '../../../hooks/typedReduxHooks';
import ModalLink from '../../ui/Modal/ModalLink';
import FullTask from '../FullTask/FullTask';
import { DateService } from '../../../services/DateService';
import { DraggableProvidedDragHandleProps } from 'react-beautiful-dnd';
import { getCssVariable, getPlural } from '../../../utilities/utilities';

interface TaskProps extends ComponentPropsWithRef<'div'> {
	taskObject: ITask
	dragHandleProps?: DraggableProvidedDragHandleProps | null
}

let spoilerTimeout = 0


const Task = forwardRef<HTMLDivElement, TaskProps>(function({
	taskObject: task,
	className = '',
	dragHandleProps,
	...props
}: TaskProps, ref) {

	if (!spoilerTimeout) spoilerTimeout = getCssVariable('timer-spoiler') * 1000

	const dispatch = useAppDispatch()

	const isSubtasksVisible = true // outer option

	const subtasksWrapperRef = useRef<HTMLDivElement>(null)
	const subtasksRef = useRef<HTMLDivElement>(null)
	const defaultSubtasksHeight = '0'
	const subtasksAutoHeight = 'auto'
	let [subtasksHeight, setSubtasksHeight] = useState(isSubtasksVisible ? subtasksAutoHeight : defaultSubtasksHeight)
	let [isSubtasksRender, setIsSubtasksRender] = useState(false)
	// TODO: make it as hook

	const spoilerButtonActiveClassName = subtasksHeight === defaultSubtasksHeight ? '' : classes.active

	function handleSubtaskSpoilerClick() {
		const wrapperEl = subtasksWrapperRef.current
		const subtasksEl = subtasksRef.current
		if (wrapperEl && subtasksEl) {
			let style = getComputedStyle(subtasksEl)
			let height = parseFloat(style.marginTop) + parseFloat(style.marginBottom) + subtasksEl.offsetHeight
			setSubtasksHeight(height + 'px')
			if (subtasksHeight === defaultSubtasksHeight) {
				setTimeout(() => {
					setSubtasksHeight(subtasksAutoHeight)
				}, spoilerTimeout)
			}
			else {
				setIsSubtasksRender(true)
			}
		}
	}

	useEffect(() => {
		if (isSubtasksRender) {
			setIsSubtasksRender(false)
			setSubtasksHeight(defaultSubtasksHeight)
		}
	}, [isSubtasksRender])


	const priority = 'priority_' + task.priority

	const comments = 99
	const attachments = 1
	const remainingTime = DateService.getRemainingTime(task.createDate , task.expireDate)



	return (
		<div className={`${className} ${classes.wrapper}`} {...props} ref={ref}>
			<div className={`${classes.priority} ${classes[priority]}`} {...dragHandleProps}></div>

			<ModalLink name='task-modal' content={<FullTask taskObject={task} />}>
				<button className={classes.title} title='edit task'>{task.title}</button>
			</ModalLink>
			{/* <ModalLink name='task-modal' content={<FullTask taskObject={task} />}> */}
				<p className={classes.description} title={task.description}>{task.description}</p>
			{/* </ModalLink> */}

			<div className={classes.taskDetails}>
				<div className={classes.detailsItem} title={getPlural(comments, 'comment')}>
					<Icon className={classes.detailsIcon} name='icon-comment' />
					<span>{comments}</span>
				</div>
				<div className={classes.detailsItem} title={getPlural(attachments, 'attachment')}>
					<Icon className={classes.detailsIcon} name='icon-file' />
					<span>{attachments}</span>
				</div>
				<div className={classes.detailsItem} title={`time remaining`}>
					<Icon className={classes.detailsIcon} name='icon-clock' />
					<span>{remainingTime}</span>
				</div>
			</div>
			<div className={classes.dragButton} {...dragHandleProps}>
				<Icon name='icon-drag' />
			</div>
			<button
				className={`${classes.spoilerButton} ${spoilerButtonActiveClassName}`}
				onClick={handleSubtaskSpoilerClick}
				title={getPlural(task.subtasks.length, 'subtask')}
			>
				<span className={classes.spoilerButtonIconBox}>
					<Icon name='icon-arrow-short' />
					{!!task.subtasks.length &&
						<span className={classes.spoilerButtonBubble}>{task.subtasks.length}</span>
					}
				</span>
			</button>
			<div className={classes.subtasksWrapper} ref={subtasksWrapperRef} style={{height: subtasksHeight}}>
				<Subtasks className={classes.subtasks} parentId={task.id} ref={subtasksRef} />
			</div>
		</div>
	)
})
export default Task