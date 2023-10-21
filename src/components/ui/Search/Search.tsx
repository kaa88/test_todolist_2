import { ComponentProps, ChangeEvent, useEffect, useState, MouseEvent, useRef } from 'react';
import { useAppDispatch, useAppSelector } from '../../../hooks/typedReduxHooks';
import classes from './Search.module.scss';
import Icon from '../Icon/Icon';
import ModalLink from '../Modal/ModalLink';
import { ITask } from '../../../types/types';
import { useFetching } from '../../../hooks/useFetching';
import Loader from '../Loader/Loader';
import LoadError from '../Loader/LoadError';
import { ApiService } from '../../../services/ApiService';

interface SearchProps extends ComponentProps<'div'> {}


const Search = function({className = '', ...props}: SearchProps) {

	// const dispatch = useAppDispatch()
	// const userSettings = useAppSelector(state => state.user)

	let [isLoadData, setIsLoadData] = useState(false)
	const loadData = async () => {
		let response = await ApiService.tasks.getAll(null)
		if (response.data) allFetchedTasks = response.data
	}
	let {fetch, isLoading, error: loadError} = useFetching(loadData)
	useEffect(() => {
		if (isLoadData) {
			setIsLoadData(false)
			fetch()
		}
	}, [isLoadData])

	const inputRef = useRef<HTMLInputElement>(null)
	let [inputValue, setInputValue] = useState('')
	let [result, setResult] = useState<ITask[]>([])

	const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
		setInputValue(e.target.value)
		setResult(searchTasks(e.target.value))
	}

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
			<ModalLink name='search' content={modalContent} onOpen={loadData}>
				<button className={classes.mainButton}>
					<Icon name='icon-search' />
					<span>Search tasks</span>
				</button>
			</ModalLink>
		</div>
	)
}
export default Search


let allFetchedTasks: ITask[] = []

const searchTasks = (value: string) => {
	let matchedTasks = allFetchedTasks.filter(item =>
		new RegExp(value, 'i').test(item.id.toString()) || new RegExp(value, 'i').test(item.title)
	)
	return matchedTasks
}
