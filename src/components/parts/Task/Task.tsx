import { ComponentPropsWithRef, forwardRef, useEffect, useRef, useState, memo } from 'react';
import classes from './Task.module.scss';
import { ITask, TaskStatus } from '../../../types/types';
import Icon from '../../ui/Icon/Icon';
import Subtasks from '../Subtasks/Subtasks';
import { useAppSelector } from '../../../hooks/typedReduxHooks';
import { DateService } from '../../../services/DateService';
import { DraggableProvidedDragHandleProps } from 'react-beautiful-dnd';
import { getCssVariable, getPlural } from '../../../utilities/utilities';
import { ModalLink } from '../../ui/Modal/Modal';
import { CurrentDraggedElement } from '../TodosTable/TodosTable';

interface TaskProps extends ComponentPropsWithRef<'div'> {
	taskObject: ITask
	dragHandleProps?: DraggableProvidedDragHandleProps | null
	currentDraggedElement?: CurrentDraggedElement
	onFullTaskOpen: (taskObject: ITask) => void
}

let spoilerTimeout = 0


const Task = memo(forwardRef<HTMLDivElement, TaskProps>(function({
	taskObject: task,
	className = '',
	dragHandleProps,
	currentDraggedElement,
	onFullTaskOpen,
	...props
}: TaskProps, ref) {

	if (!spoilerTimeout) spoilerTimeout = getCssVariable('timer-spoiler') * 1000

	const isSubtasksVisible = useAppSelector(state => state.user.showSubtasks)
	const subtasksWrapperRef = useRef<HTMLDivElement>(null)
	const subtasksRef = useRef<HTMLDivElement>(null)
	const defaultSubtasksHeight = '0'
	const subtasksAutoHeight = 'auto'
	let [subtasksHeight, setSubtasksHeight] = useState(isSubtasksVisible ? subtasksAutoHeight : defaultSubtasksHeight)
	let [isSubtasksRender, setIsSubtasksRender] = useState(false)

	useEffect(() => {
		setSubtasksHeight(isSubtasksVisible ? subtasksAutoHeight : defaultSubtasksHeight)
	}, [isSubtasksVisible])

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

	const comments = task.commentsCount || 0
	const attachments = task.filesCount || 0
	const remainingTime = DateService.getRemainingTime(Date.now(), task.expireDate)

	const expiredClassName = task.expireDate - Date.now() <= 0 ? classes.expired : ''

	const openFullTask = () => {
		onFullTaskOpen(task)
	}

	
	return (
		<div className={`${className} ${classes.wrapper}`} {...props} ref={ref}>
			<div className={`${classes.priority} ${classes[priority]}`} {...dragHandleProps}></div>

			<div className={classes.header} {...dragHandleProps}>
				<div className={classes.taskId}>#{task.id}</div>
				<div className={classes.dragButton}>
					<Icon name='icon-drag' />
				</div>
			</div>

			<ModalLink>
				<button className={classes.title} onClick={openFullTask} title='edit task'>{task.title}</button>
			</ModalLink>
			<p className={classes.description} title={task.description}>{task.description}</p>

			<div className={classes.taskDetails}>
				<div className={classes.detailsItem} title={getPlural(comments, 'comment')}>
					<Icon className={classes.detailsIcon} name='icon-comment' />
					<span>{comments}</span>
				</div>
				<div className={classes.detailsItem} title={getPlural(attachments, 'attachment')}>
					<Icon className={classes.detailsIcon} name='icon-file' />
					<span>{attachments}</span>
				</div>
				{task.status !== TaskStatus.done &&
					<div className={classes.detailsItem} title={`time remaining`}>
						<Icon className={`${classes.detailsIcon} ${expiredClassName}`} name='icon-clock' />
						<span className={expiredClassName}>{remainingTime}</span>
					</div>
				}
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
				<Subtasks
					className={classes.subtasks}
					parentId={task.id}
					currentDraggedElement={currentDraggedElement}
					ref={subtasksRef}
				/>
			</div>
		</div>
	)
}))
export default Task