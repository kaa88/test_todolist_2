import { ComponentProps } from 'react';
import classes from './Header.module.scss';
import Icon from '../../ui/Icon/Icon';
import { useAppDispatch, useAppSelector } from '../../../hooks/typedReduxHooks';
import { createNewTask } from '../../../store/reducers/taskReducer';

interface HeaderProps extends ComponentProps<'header'> {}

const Header = function({className = ''}: HeaderProps) {

	const dispatch = useAppDispatch()
	const currentProject = useAppSelector(state => state.projects.current)
	
	const createTask = () => {
		if (typeof currentProject === 'number') dispatch(createNewTask(currentProject))
	}

	return (
		<header className={`${className} ${classes.header}`}>
			<button className={classes.headerButton} onClick={createTask}>
				<Icon name='icon-cross-bold' />
				<span>Add task</span>
			</button>
			<button className={classes.headerButton}>
				<span>Show all subtasks</span>
			</button>
			<div className={classes.headerItem}>
				sort by
			</div>
			<div className={classes.headerItem}>
				search task
			</div>
		</header>
)
}
export default Header