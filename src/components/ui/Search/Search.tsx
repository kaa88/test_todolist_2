import { ComponentProps, ChangeEvent, useEffect, useState, useRef } from 'react';
import classes from './Search.module.scss';
import Icon from '../Icon/Icon';
import { ITask } from '../../../types/types';
import { useFetching } from '../../../hooks/useFetching';
import Loader from '../Loader/Loader';
import LoadError from '../Loader/LoadError';
import { ApiService } from '../../../services/ApiService';
import { Modal, ModalLink } from '../Modal/Modal';

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
		if (isLoading) return;
		setInputValue(e.target.value)
		setResult(searchTasks(e.target.value))
	}

	let [isModalActive, setIsModalActive] = useState(false)
	const handleModalOpen = () => {
		setIsModalActive(true)
	}
	const handleModalClose = () => {
		setIsModalActive(false)
		setInputValue('')
		setResult([])
	}
	useEffect(() => {
		if (isModalActive) {
			fetch()
			setTimeout(() => {
				const inputEl = inputRef.current
				if (inputEl) inputEl.focus()
			}, 100)
		}
	}, [isModalActive])


	const modalContent =
		<div className={classes.modalContent}>
			{isLoading && <Loader className={classes.loader} />}
			{loadError && <LoadError className={classes.loadError} message='Search module error' />}
			{(!isLoading || !loadError) && <>
				<input
					className={classes.input}
					type="text"
					value={inputValue}
					onChange={handleInputChange}
					ref={inputRef}
				/>
				<div className={classes.results}>
					<p>results:</p>
					{result.map((item, index) =>
						<div className={classes.resultItem} key={index}>
							result: {`${item.id} ${item.title}`}
						</div>
					)}
				</div>
			</>}
		</div>


	return (
		<div className={`${className} ${classes.wrapper}`} {...props}>
			<ModalLink>
				<button className={classes.mainButton} onClick={handleModalOpen}>
					<Icon name='icon-search' />
					<span>Search tasks</span>
				</button>
			</ModalLink>
			<Modal isActive={isModalActive} onClose={handleModalClose}>
				{modalContent}
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
	}
	)
	return matchedTasks
}
