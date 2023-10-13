import { ComponentProps, MouseEvent, useState } from 'react';
import classes from './RadioButtons.module.scss';
import { ITask, TaskPriority, TaskStatus } from '../../../types/types';
import { RadioButtonsContent } from '../../parts/FullTask/FullTask';

interface RadioButtonsProps<T> extends ComponentProps<'div'> {
	modif?: 'default' | 'status' | 'priority'
	buttons: RadioButtonsContent<T>[]
	active: T
	callback: (value: T) => void
}

// interface StatusItem {
// 	id: TaskStatus
// 	textContent: string
// }

const RadioButtons = function<T>({modif = 'default', buttons, active, callback, className = '', ...props}: RadioButtonsProps<T>) {

	let [activeID, setActiveID] = useState(active)

	const handleClick = (e: MouseEvent<HTMLButtonElement>) => {
		let name = e.currentTarget.dataset.name as T
		if (name) {
			setActiveID(name)
			callback(name)
		}
	}

	return (
		<div className={`${className} ${classes[modif]}`} {...props}>
			{buttons.map((item, index) =>
				<button
					className={`${classes.button} ${item.id === activeID ? classes.active : ''}`}
					data-name={item.id}
					onClick={handleClick}
					key={index}
				>
					{item.textContent}
				</button>
			)}
		</div>
	)
}
export default RadioButtons