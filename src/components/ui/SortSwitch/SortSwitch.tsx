import { ComponentProps, ChangeEvent, useEffect, useState, MouseEvent } from 'react';
import classes from './SortSwitch.module.scss';
import { TaskSort } from '../../../types/types';
import { updateSettings } from '../../../store/reducers/userReducer';
import { useAppDispatch, useAppSelector } from '../../../hooks/typedReduxHooks';
import Button from '../Button/Button';

interface SortSwitchProps extends ComponentProps<'div'> {}

const SortSwitch = function({className = '', ...props}: SortSwitchProps) {

	const dispatch = useAppDispatch()
	const userSettings = useAppSelector(state => state.user)

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

	
	return (
		<div className={`${className} ${classes.wrapper}`} {...props}>
			<Button className={classes.button} variant='negative' onClick={toggleSortVisibility}>
				Sort by
			</Button>
			<div className={`${classes.popup} ${isSortPopupVisible ? classes.visible: ''}`} onClick={(e) => e.stopPropagation()}>
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
	)
}
export default SortSwitch


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
