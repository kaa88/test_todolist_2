import { ComponentPropsWithoutRef, useEffect, useState } from 'react';
import classes from './TodosTable.module.scss';
import Container from '../../ui/Container/Container';
import { useFetching } from '../../../hooks/useFetching';
import { ITask } from '../../../types/types';
import { taskService } from '../../../services/taskService';
import Task from '../../ui/Task/Task';

interface TodosTableProps extends ComponentPropsWithoutRef<'div'> {
	project: number
}

const TodosTable = function({project, className = ''}: TodosTableProps) {

	let [tasks, setTasks] = useState<ITask[]>([])

	const getTasks = async () => {
		let tasks = await taskService.getTasks(project)
		setTasks(tasks)
	}

	useEffect(() => {
		fetch()
	}, [project])

	let {fetch, isLoading, error} = useFetching(getTasks)

	const taskGroups: {[key: string]: ITask[]} = {
		queue: [],
		dev: [], // wrong name
		done: [],
	}
	tasks.forEach(task => taskGroups[task.status].push(task))

	const getTaskElements = (group: ITask[]) =>
		group.map((task, index) =>
			<Task
				className={classes.task}
				taskObject={task}
				key={index}
			/>
		)

	return (
		<Container className={classes.container}>
			<p>{`todos ${project} ${isLoading ? 'LOADING' : ''}`}</p>
			<div className={`${className} ${classes.table}`}>
				<div className={`${classes.cell} ${classes.queue}`}>
					{getTaskElements(taskGroups.queue)}
				</div>
				<div className={`${classes.cell} ${classes.dev}`}>
					{getTaskElements(taskGroups.dev)}
				</div>
				<div className={`${classes.cell} ${classes.done}`}>
					{getTaskElements(taskGroups.done)}
				</div>
			</div>
		</Container>
	)
}
export default TodosTable