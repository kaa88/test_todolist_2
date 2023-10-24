import { ComponentProps, ChangeEvent, useEffect, useState, useRef, MouseEvent, KeyboardEvent } from 'react';
import classes from './Search.module.scss';
import Icon from '../Icon/Icon';
import { ITask, Id } from '../../../types/types';
import { useFetching } from '../../../hooks/useFetching';
import Loader from '../Loader/Loader';
import LoadError from '../Loader/LoadError';
import { ApiService } from '../../../services/ApiService';
import { Modal, ModalLink } from '../Modal/Modal';
import FullTask from '../../parts/FullTask/FullTask';
import Button from '../Button/Button';

enum ActiveModalType {
	none = '',
	search = 'search',
	task = 'task'
}

interface SearchProps extends ComponentProps<'div'> {}


const Search = function({className = '', ...props}: SearchProps) {

	const loadData = async () => {
		let response = await ApiService.tasks.getAll(null)
		if (response.data) allFetchedTasks = response.data
	}
	let {fetch, isLoading, error: loadError} = useFetching(loadData)


	const inputRef = useRef<HTMLInputElement>(null)
	let [inputValue, setInputValue] = useState('')
	let [result, setResult] = useState<ITask[]>([])

	const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
		if (isLoading || loadError) return;
		setInputValue(e.target.value)
		setResult(searchTasks(e.target.value))
	}

	let [activeModalType, setActiveModalType] = useState(ActiveModalType.none)
	let [currentTaskId, setCurrentTaskId] = useState<Id>(0)
	const handleModalOpen = () => {
		setActiveModalType(ActiveModalType.search)
	}
	const handleModalClose = () => {
		setActiveModalType(ActiveModalType.none)
		setInputValue('')
		setResult([])
	}
	const openTask = (e: MouseEvent<HTMLButtonElement>) => {
		const taskId = Number(e.currentTarget.dataset.id)
		if (!isNaN(taskId)) {
			setCurrentTaskId(taskId)
			setActiveModalType(ActiveModalType.task)
		}
	}
	useEffect(() => {
		if (activeModalType === ActiveModalType.search) {
			fetch()
			setTimeout(() => {
				const inputEl = inputRef.current
				if (inputEl) inputEl.focus()
			}, 100)
		}
	}, [activeModalType])

	const handleInputKeydown = (e: KeyboardEvent<HTMLInputElement>) => {
		if (e.key === 'Escape') handleModalClose()
	}

	const searchModalContent =
		<div className={classes.searchModalContent}>
			{isLoading && <Loader className={classes.loader} />}
			{!!loadError && <LoadError className={classes.loadError} message='Search module error' />}
			<div className={classes.inputWrapper}>
				<Icon className={classes.inputIcon} name='icon-search' />
				<input
					className={classes.input}
					type="text"
					value={inputValue}
					onChange={handleInputChange}
					onKeyDown={handleInputKeydown}
					placeholder='Search by task ID or title'
					ref={inputRef}
				/>
			</div>
			<div className={classes.results}>
				{result.map((item, index) =>
					<button
						className={classes.resultItem}
						onClick={openTask}
						data-id={item.id}
						key={index}
					>
						{`#${item.id} - ${item.title}`}
					</button>
				)}
			</div>
		</div>

	const currentTask = result.find(item => item.id === currentTaskId)
	const taskModalContent = currentTask ? <FullTask taskObject={currentTask} /> : null

	const modalContent = {
		[ActiveModalType.search]: searchModalContent,
		[ActiveModalType.task]: taskModalContent
	}

	return (
		<div className={`${className} ${classes.wrapper}`} {...props}>
			<ModalLink>
				<Button className={classes.mainButton} variant='negative' onClick={handleModalOpen}>
					<Icon name='icon-search' />
					<span>Search tasks</span>
					</Button>
			</ModalLink>
			<Modal className={classes.modal} isActive={activeModalType ? true : false} onClose={handleModalClose}>
				{activeModalType ? modalContent[activeModalType] : null}
			</Modal>
		</div>
	)
}
export default Search



let allFetchedTasks: ITask[] = []

const searchTasks = (value: string) => {
	if (!value) return []
	let matchedTasks = allFetchedTasks.filter(item =>{
		return new RegExp(value, 'i').test(item.id.toString()) || new RegExp(value, 'i').test(item.title)
	})
	return matchedTasks
}
