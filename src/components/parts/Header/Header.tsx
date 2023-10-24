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
import { transitionIsLocked } from '../../../utilities/transitionLock';
import { getCssVariable } from '../../../utilities/utilities';

interface HeaderProps extends ComponentProps<'header'> {
	type?: PageType
}

let menuTimeout = 0
let mobileBreakpoint = 0

const Header = function({className = '', type}: HeaderProps) {

	if (!menuTimeout) menuTimeout = getCssVariable('timer-menu') * 1000
	if (!mobileBreakpoint) mobileBreakpoint = getCssVariable('media-mobile')

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
			closeMenu()
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

	// Menu
	let [isMenuActive, setIsMenuActive] = useState(false)
	const toggleMenu = () => {
		if (transitionIsLocked(menuTimeout)) return;
		setIsMenuActive(isMenuActive ? false : true)
	}
	const closeMenu = () => {
		setIsMenuActive(false)
	}

	const checkIfMobileView = () => window.innerWidth <= mobileBreakpoint ? true : false
	const updateViewport = () => setIsMobileState(checkIfMobileView())
	let [isMobileState, setIsMobileState] = useState(checkIfMobileView())

	useEffect(() => {
		window.addEventListener('resize', closeMenu)
		window.addEventListener('resize', updateViewport)
		return () => {
			window.removeEventListener('resize', closeMenu)
			window.removeEventListener('resize', updateViewport)
		}
	}, []) // eslint-disable-line react-hooks/exhaustive-deps
	// /Menu

	
	const defaultTypeContent = null

	const projectsTypeContent =
		<div className={classes.content}>
			<Search />
		</div>

	const tasksTypeContent =
		<div className={classes.content}>
			<ModalLink>
				<Button className={classes.button} variant='negative' onClick={createTask}>
					<Icon name='icon-cross-bold' />
					<span>Add task</span>
				</Button>
			</ModalLink>
			<Modal isActive={isModalActive} onClose={handleModalClose}>
				{modalContent}
			</Modal>

			<SortSwitch className={classes.sortSwitch} />

			<Button className={classes.button} variant='negative' onClick={toggleSubtasksVisibility}>
				<span>
					{userSettings.showSubtasks
						? 'Hide all subtasks'
						: 'Show all subtasks'
					}
				</span>
			</Button>

			<Search closeMenuCallback={closeMenu} />
		</div>

	let headerContent
	switch(type) {
		case PageType.projects: headerContent = projectsTypeContent; break;
		case PageType.tasks: headerContent = tasksTypeContent; break;
		default: headerContent = defaultTypeContent
	}

	return (
		<header className={`${className} ${classes.header}`}>
			<Container className={classes.container}>
				<div className={classes.logoWrapper}>
					<Logo className={classes.logo} />
				</div>

				<div className={classes.menu}>
					{isMobileState &&
						<button className={`${classes.menuButton} ${isMenuActive ? classes.active : ''}`} onClick={toggleMenu}>
							<Icon name='icon-menu' />
						</button>
					}
					<div className={`${classes.menuWrapper} ${isMobileState ? classes.mobile : ''} ${isMenuActive ? classes.active : ''}`}>
						{headerContent}
					</div>
				</div>
			</Container>
		</header>
	)
}
export default Header

