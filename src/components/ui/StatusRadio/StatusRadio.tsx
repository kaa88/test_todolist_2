import { ComponentProps, MouseEvent, useState } from 'react';
import classes from './StatusRadio.module.scss';
import { ITask, TaskStatus } from '../../../types/types';

interface StatusRadioProps extends ComponentProps<'div'> {
	task: ITask
	callback: (value: TaskStatus) => void //?
}

interface StatusItem {
	id: TaskStatus
	textContent: string
}

const StatusRadio = function({className = '', task, callback, ...props}: StatusRadioProps) {

	const status: StatusItem[] = [
		{
			id: TaskStatus.queue,
			textContent: 'Queue',
		},
		{
			id: TaskStatus.dev,
			textContent: 'Development',
		},
		{
			id: TaskStatus.done,
			textContent: 'Done',
		}
	]

	let [active, setActive] = useState(task.status)

	const handleClick = (e: MouseEvent<HTMLButtonElement>) => {
		let name = e.currentTarget.dataset.name as TaskStatus
		if (name) {
			setActive(name)
			callback(name)
		}
	}

	return (
		<div className={`${className} ${classes.default}`} {...props}>
			{status.map(item =>
				<button
					className={`${classes.button} ${classes[item.id]} ${item.id === active ? classes.active : ''}`}
					data-name={item.id}
					onClick={handleClick}
				>
					{item.textContent}
				</button>
			)}
		</div>
	)
}
export default StatusRadio