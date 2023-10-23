import { ComponentProps, useEffect, useState, ReactElement } from 'react';
import classes from './Header.module.scss';
import Icon from '../../ui/Icon/Icon';
import { useAppDispatch, useAppSelector } from '../../../hooks/typedReduxHooks';
import { createNewTask } from '../../../store/reducers/taskReducer';
import Loader from '../../ui/Loader/Loader';
import FullTask from '../FullTask/FullTask';
import LoadError from '../../ui/Loader/LoadError';
import { updateSettings } from '../../../store/reducers/userReducer';
import SortSwitch from '../../ui/SortSwitch/SortSwitch';
import Search from '../../ui/Search/Search';
import { Modal, ModalLink } from '../../ui/Modal/Modal';
import { PageType } from '../../../types/types';
import Logo from '../../ui/Logo/Logo';
import Container from '../../ui/Container/Container';
import Button from '../../ui/Button/Button';
import { updateProjectTaskCount } from '../../../store/reducers/projectReducer';

interface HeaderProps extends ComponentProps<'header'> {
	type?: PageType
}

const Header = function({className = '', type}: HeaderProps) {

	const dispatch = useAppDispatch()

	// New Task
	const currentProject = useAppSelector(state => state.projects.current)
	const {list, lastAddedTaskId} = useAppSelector(state => state.tasks)
	let [isWaitingForResponse, setIsWaitingForResponse] = useState(false)

	let [modalContent, setModalContent] = useState<ReactElement | null>(null)

	const createTask = () => {
		if (typeof currentProject === 'number') {
			dispatch(createNewTask(currentProject))
			dispatch(updateProjectTaskCount({projectId: currentProject, increment: true}))
			setModalContent(newTaskModalContentLoading)
			setIsModalActive(true)
			setIsWaitingForResponse(true)
		}
	}
	useEffect(() => {
		if (isWaitingForResponse) {
			setIsWaitingForResponse(false)
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


	const defaultTypeContent =
		<div className={classes.middlePart}>
		</div>

	const tasksTypeContent =
		<div className={classes.middlePart}>
			<ModalLink>
				<Button className={classes.button} variant='negative' onClick={createTask}>
					<Icon name='icon-cross-bold' />
					<span>Add task</span>
				</Button>
			</ModalLink>
			<Modal isActive={isModalActive} onClose={handleModalClose}>
				{modalContent}
			</Modal>

			<Button className={classes.button} variant='negative' onClick={toggleSubtasksVisibility}>
				<span>
					{userSettings.showSubtasks
						? 'Hide all subtasks'
						: 'Show all subtasks'
					}
				</span>
			</Button>

			<SortSwitch className={classes.sortSwitch} />
		</div>


	return (
		<header className={`${className} ${classes.header}`}>
			<Container className={classes.container}>
				<div className={classes.logo}>
					<Logo />
				</div>
				{type === PageType.tasks ? tasksTypeContent : defaultTypeContent}
				<div className={classes.search}>
					<Search />
				</div>
			</Container>
		</header>
	)
}
export default Header

