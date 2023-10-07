import { ComponentPropsWithoutRef, useEffect, useState } from 'react';
import classes from './TodosTable.module.scss';
import Container from '../../ui/Container/Container';
import { useFetching } from '../../../hooks/useFetching';
import { ITask, TaskStatus } from '../../../types/types';
import { apiService } from '../../../services/apiService';
import Task from '../Task/Task';

interface TodosTableProps extends ComponentPropsWithoutRef<'div'> {
	project: number
}

const TodosTable = function({project, className = ''}: TodosTableProps) {

	let [tasks, setTasks] = useState<ITask[]>([])

	const getTasks = async () => {
		let tasks = await apiService.tasks.get(project)
		setTasks(tasks)
	}

	useEffect(() => {
		fetch()
	}, [project])

	let {fetch, isLoading, error} = useFetching(getTasks)

	const taskGroups: {[key: string]: ITask[]} = {
		[TaskStatus.queue]: [],
		[TaskStatus.dev]: [],
		[TaskStatus.done]: [],
	}
	tasks.forEach(task => taskGroups[task.status].push(task))
	console.log(taskGroups)
	console.log(tasks)

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
			<p>{`todos - ${project} - show all subtasks - sort by - search ${isLoading ? '- LOADING' : ''}`}</p>

			<div className={`${className} ${classes.table}`}>
				<div className={`${classes.cell} ${classes.queue}`}>
					<p className={classes.cellTitle}>Queue</p>
					<div className={classes.tasks}>
						{getTaskElements(taskGroups[TaskStatus.queue])}
					</div>
				</div>
				<div className={`${classes.cell} ${classes.dev}`}>
					<p className={classes.cellTitle}>Development</p>
					<div className={classes.tasks}>
						{getTaskElements(taskGroups[TaskStatus.dev])}
					</div>
				</div>
				<div className={`${classes.cell} ${classes.done}`}>
					<p className={classes.cellTitle}>Done</p>
					<div className={classes.tasks}>
						{getTaskElements(taskGroups[TaskStatus.done])}
					</div>
				</div>
			</div>
		</Container>
	)
}
export default TodosTable