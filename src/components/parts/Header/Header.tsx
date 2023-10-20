import { ChangeEvent, ComponentProps, useEffect, useState, MouseEvent } from 'react';
import classes from './Header.module.scss';
import Icon from '../../ui/Icon/Icon';
import { useAppDispatch, useAppSelector } from '../../../hooks/typedReduxHooks';
import { createNewTask } from '../../../store/reducers/taskReducer';
import { setActiveModal } from '../../../store/reducers/modalReducer';
import Loader from '../../ui/Loader/Loader';
import FullTask from '../FullTask/FullTask';
import LoadError from '../../ui/Loader/LoadError';
import { updateSettings } from '../../../store/reducers/userReducer';
import { TaskSort } from '../../../types/types';

interface HeaderProps extends ComponentProps<'header'> {}

const Header = function({className = ''}: HeaderProps) {

	const dispatch = useAppDispatch()

	// New Task
	const currentProject = useAppSelector(state => state.projects.current)
	const {list, lastAddedTaskId} = useAppSelector(state => state.tasks)
	let [isWaitingForResponse, setIsWaitingForResponse] = useState(false)
	const createTask = () => {
		if (typeof currentProject === 'number') {
			dispatch(createNewTask(currentProject))
			dispatch(setActiveModal({name: 'newTask', content: newTaskModalContentLoading}))
			setIsWaitingForResponse(true)
		}
	}
	useEffect(() => {
		if (isWaitingForResponse) {
			setIsWaitingForResponse(false)
			dispatch(setActiveModal({name: 'newTask', content: getNewTaskContent()}))
		}
	}, [lastAddedTaskId])

	const newTaskModalContentLoading = <div className={classes.emptyModal}><Loader className={classes.modalLoader} /></div>
	const getNewTaskContent = () => {
		let taskObject = list.find(task => task.id === lastAddedTaskId)
		return taskObject
			? <FullTask taskObject={taskObject} />
			: <div className={classes.emptyModal}><LoadError className={classes.modalLoader} message='Error on creating a task' /></div>
	}
	// /New Task

	const userSettings = useAppSelector(state => state.user)
	// Show subtasks
	const toggleSubtasksVisibility = () => {
		dispatch(updateSettings({...userSettings, showSubtasks: userSettings.showSubtasks ? false : true}))
	}
	// /Show subtasks

	// Sort
	let [isSortPopupVisible, setIsSortPopupVisible] = useState(false)
	const toggleSortVisibility = function(e: MouseEvent<HTMLButtonElement | Window>) {
		e.stopPropagation()
		let newState = isSortPopupVisible ? false : true
		if (e.currentTarget === window) newState = false
		setIsSortPopupVisible(newState)
	}
	const updateSortSettings = (e: ChangeEvent<HTMLInputElement>) => {
		const isAdd = e.currentTarget.checked
		const currentSortType = e.currentTarget.dataset.type as TaskSort
		if (isAdd) dispatch(updateSettings({...userSettings, sortBy: currentSortType}))
	}
	useEffect(() => {
		window.addEventListener('click', toggleSortVisibility as any)
		return () => window.removeEventListener('click', toggleSortVisibility as any)
	}, [])
	// /Sort

	return (
		<header className={`${className} ${classes.header}`}>
			<button className={classes.headerButton} onClick={createTask}>
				<Icon name='icon-cross-bold' />
				<span>Add task</span>
			</button>
			<button className={classes.headerButton} onClick={toggleSubtasksVisibility}>
				<span>
					{userSettings.showSubtasks
						? 'Hide all subtasks'
						: 'Show all subtasks'
					}
				</span>
			</button>
			<div className={classes.sortWrapper}>
				<button className={classes.sortButton} onClick={toggleSortVisibility}>
					<span>Sort by</span>
				</button>
				<div className={`${classes.sortPopup} ${isSortPopupVisible ? classes.visible: ''}`} onClick={(e) => e.stopPropagation()}>
					{sortItems.map((item, index) =>
						<label className={classes.sortInput} key={index}>
							<input
								type="radio"
								name='sort-radio'
								onChange={updateSortSettings}
								data-type={item.id}
								checked={userSettings.sortBy === item.id}
							/>
							<span>{item.textContent}</span>
						</label>
					)}
				</div>
			</div>
			<div className={classes.headerItem}>
				search task
			</div>
		</header>
)
}
export default Header


const sortItems = [
	{
		id: TaskSort.id,
		textContent: 'ID',
	},
	{
		id: TaskSort.creation,
		textContent: 'Creation time',
	},
	{
		id: TaskSort.expiration,
		textContent: 'Expiration time',
	},
	{
		id: TaskSort.priority,
		textContent: 'Priority',
	},
]

