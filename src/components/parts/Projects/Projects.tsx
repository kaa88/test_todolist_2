import { ComponentPropsWithoutRef, MouseEvent, useState, useEffect, useRef, ChangeEvent, KeyboardEvent } from 'react';
import classes from './Projects.module.scss';
import { Link } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../../hooks/typedReduxHooks';
import Container from '../../ui/Container/Container';
import Icon from '../../ui/Icon/Icon';
import { createNewProject, deleteProject, updateProject } from '../../../store/reducers/projectReducer';
import { Modal, ModalLink } from '../../ui/Modal/Modal';
import { Id } from '../../../types/types';
import Loader from '../../ui/Loader/Loader';
import LoadError from '../../ui/Loader/LoadError';

enum ActiveModalType {
	none = '',
	create = 'create',
	edit = 'edit'
}


interface ProjectsProps extends ComponentPropsWithoutRef<'div'> {}

const Projects = function({className = '', children, ...props}: ProjectsProps) {

	const dispatch = useAppDispatch()
	
	let {isLoading, loadError, list} = useAppSelector(state => state.projects)
	const projects = [...list].reverse()

	const inputRef = useRef<HTMLInputElement>(null)
	let [inputValue, setInputValue] = useState('')
	let [isInputError, setIsInputError] = useState(false)
	const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
		setInputValue(e.currentTarget.value)
		if (isInputError) setIsInputError(false)
	}

	let [activeModalType, setActiveModalType] = useState(ActiveModalType.none)
	let [currentProjectId, setCurrentProjectId] = useState<Id>(0)

	console.log(activeModalType)

	const handleModalOpen = (e: MouseEvent<HTMLButtonElement>) => {
		if (isInputError) setIsInputError(false)
		const targetDataId = e.currentTarget.dataset.id
		if (targetDataId) {
			const projectId = Number(targetDataId)
			if (!isNaN(projectId)) {
				setCurrentProjectId(projectId)
				let current = projects.find(p => p.id === projectId)
				let name = current ? current.name : ''
				setInputValue(name)
				setActiveModalType(ActiveModalType.edit)
			}
		}
		else setActiveModalType(ActiveModalType.create)
	}
	const handleModalClose = () => {
		setActiveModalType(ActiveModalType.none)
		if (inputValue) setInputValue('')
		if (isInputError) setIsInputError(false)
	}
	useEffect(() => {
		if (activeModalType !== ActiveModalType.none) {
			setTimeout(() => {
				const inputEl = inputRef.current
				if (inputEl) inputEl.focus()
			}, 100)
		}
	}, [activeModalType])



	const createProject = () => {
		if (!inputValue) return setIsInputError(true)
		dispatch(createNewProject(inputValue))
		setActiveModalType(ActiveModalType.none)
		setInputValue('')
}
	const editProject = () => {
		if (!inputValue) return setIsInputError(true)
		const currentProject = projects.find(p => p.id === currentProjectId)
		if (currentProject) {
			if (inputValue !== currentProject.name)
				dispatch(updateProject({...currentProject, name: inputValue}))
			setActiveModalType(ActiveModalType.none)
			setInputValue('')
		}
	}
	const deleteCurrentProject = (e: MouseEvent<HTMLButtonElement>) => {
		const projectId = Number(e.currentTarget.dataset.id)
		if (!isNaN(projectId)) {
			let current = projects.find(p => p.id === projectId)
			if (current) {
				let isConfirm = window.confirm(`Are you sure you want to delete project "${current.name}"?`)
				if (isConfirm) dispatch(deleteProject(current))
			}
		}
	}

	const handleInputKeydown = (e: KeyboardEvent<HTMLInputElement>) => {
		if (e.key === 'Enter') {
			if (activeModalType === ActiveModalType.create) createProject()
			if (activeModalType === ActiveModalType.edit) editProject()
		}
		if (e.key === 'Escape') {
			handleModalClose()
		}
	}

	let modalTitle = ''
	if (activeModalType === ActiveModalType.create) modalTitle = 'New Project'
	if (activeModalType === ActiveModalType.edit) modalTitle = 'Edit Project'

	const modalContent =
		<div className={classes.modalContent}>
			<p className={classes.modalTitle}>{modalTitle}</p>
			<p className={classes.modalInputTitle}>Project name</p>
			<input
				className={`${classes.modalInput} ${isInputError ? classes.inputError : ''}`}
				type="text"
				value={inputValue}
				onChange={handleInputChange}
				onKeyDown={handleInputKeydown}
				ref={inputRef}
			/>
			<div className={classes.modalButtons}>
				<button className={classes.confirmButton} onClick={activeModalType === ActiveModalType.create ? createProject : editProject}>
					<Icon name='icon-ok' />
				</button>
				<button className={classes.cancelButton} onClick={handleModalClose}>
					<Icon name='icon-cross-bold' />
				</button>
			</div>
		</div>

	return (
		<div className={`${className} ${classes.wrapper}`} {...props}>
			<Container className={classes.container}>
				{isLoading && <Loader className={classes.loader} variant='light' />}
				{!!loadError && <LoadError className={classes.loadError} variant='light' message='Error on loading' />}
				{(!loadError) &&
					<>
						<div className={classes.list}>
							<ModalLink>
								<button className={classes.newProjectButton} onClick={handleModalOpen}>
									<Icon name='icon-cross-bold' />
									<span>Create Project</span>
								</button>
							</ModalLink>
							{projects?.map((item, index) =>
								<div className={classes.projectButton} key={index}>
									<div className={classes.projectInfo}>
										<p className={classes.projectId}>
											{`#${item.id}`}
										</p>
										<p className={classes.taskCount}>
											{`${item.taskCount} task${item.taskCount === 1 ? '' : 's'}`}
										</p>
									</div>
									<Link to={`/project/${item.id}`} className={classes.link}>
										{`project${item.id}`}
									</Link>
									<p className={classes.projectName}>
										{item.name}
									</p>
									<div className={classes.buttons}>
										<button className={classes.editButton} onClick={handleModalOpen} data-id={item.id}>
											<Icon name='icon-pen' />
										</button>
										<button className={classes.deleteButton} onClick={deleteCurrentProject} data-id={item.id}>
											<Icon name='icon-cross' />
										</button>
									</div>
								</div>
							)}
						</div>
					</>
				}
			</Container>
			<Modal isActive={activeModalType ? true : false} onClose={handleModalClose}>
				{modalContent}
			</Modal>
		</div>
	)
}
export default Projects