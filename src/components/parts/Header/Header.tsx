import { ChangeEvent, ComponentProps, useEffect, useState, MouseEvent, ReactElement } from 'react';
import classes from './Header.module.scss';
import Icon from '../../ui/Icon/Icon';
import { useAppDispatch, useAppSelector } from '../../../hooks/typedReduxHooks';
import { createNewTask } from '../../../store/reducers/taskReducer';
// import { setActiveModal } from '../../../store/reducers/modalReducer';
import Loader from '../../ui/Loader/Loader';
import FullTask from '../FullTask/FullTask';
import LoadError from '../../ui/Loader/LoadError';
import { updateSettings } from '../../../store/reducers/userReducer';
import SortSwitch from '../../ui/SortSwitch/SortSwitch';
import Search from '../../ui/Search/Search';
import { Modal, ModalLink } from '../../ui/Modal/Modal';

interface HeaderProps extends ComponentProps<'header'> {}

const Header = function({className = ''}: HeaderProps) {

	const dispatch = useAppDispatch()

	// New Task
	const currentProject = useAppSelector(state => state.projects.current)
	const {list, lastAddedTaskId} = useAppSelector(state => state.tasks)
	let [isWaitingForResponse, setIsWaitingForResponse] = useState(false)

	let [modalContent, setModalContent] = useState<ReactElement | null>(null)

	const createTask = () => {
		if (typeof currentProject === 'number') {
			dispatch(createNewTask(currentProject))
			// dispatch(setActiveModal({name: 'newTask', content: newTaskModalContentLoading}))
			setModalContent(newTaskModalContentLoading)
			setIsModalActive(true)
			setIsWaitingForResponse(true)
		}
	}
	useEffect(() => {
		if (isWaitingForResponse) {
			setIsWaitingForResponse(false)
			// dispatch(setActiveModal({name: 'newTask', content: getNewTaskContent()}))
			setModalContent(getNewTaskContent())
		}
	}, [lastAddedTaskId])

	const newTaskModalContentLoading = <div className={classes.emptyModal}><Loader className={classes.modalLoader} /></div>
	const getNewTaskContent = () => {
		let taskObject = list.find(task => task.id === lastAddedTaskId)
		return taskObject
			? <FullTask taskObject={taskObject} />
			: <div className={classes.emptyModal}><LoadError className={classes.modalLoader} message='Error on creating a task' /></div>
	}
	let [isModalActive, setIsModalActive] = useState(false)
	// const handleModalOpen = () => {
		// setIsModalActive(true)
	// }
	const handleModalClose = () => {
		setIsModalActive(false)
	}
	// /New Task

	const userSettings = useAppSelector(state => state.user)
	// Show subtasks
	const toggleSubtasksVisibility = () => {
		dispatch(updateSettings({...userSettings, showSubtasks: userSettings.showSubtasks ? false : true}))
	}
	// /Show subtasks


	return (
		<header className={`${className} ${classes.header}`}>
			<ModalLink>
				<button className={classes.headerButton} onClick={createTask}>
					<Icon name='icon-cross-bold' />
					<span>Add task</span>
				</button>
			</ModalLink>
			<Modal isActive={isModalActive} onClose={handleModalClose}>
				{modalContent}
			</Modal>

			<button className={classes.headerButton} onClick={toggleSubtasksVisibility}>
				<span>
					{userSettings.showSubtasks
						? 'Hide all subtasks'
						: 'Show all subtasks'
					}
				</span>
			</button>
			<SortSwitch className={classes.sortSwitch} />
			<Search />
		</header>
)
}
export default Header

