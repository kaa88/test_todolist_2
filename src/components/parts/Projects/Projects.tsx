import { ComponentPropsWithoutRef } from 'react';
import classes from './Projects.module.scss';
import { Link } from 'react-router-dom';
import { useAppSelector } from '../../../hooks/typedReduxHooks';
import Container from '../../ui/Container/Container';

// TODO: add 'number of tasks' bubble

interface ProjectsProps extends ComponentPropsWithoutRef<'div'> {}

const Projects = function({className = '', children, ...props}: ProjectsProps) {
	
	let {isLoading, loadError, list: projects, current} = useAppSelector(state => state.projects)

	return (
		<Container modif="flex">
			<div className={`${className} ${classes.wrapper}`} {...props}>
				{isLoading && <p className={classes.loader}>LOADING</p>}
				{loadError
					? <p className={classes.error}>{loadError}</p>
					: projects?.map((item, index) =>
						<Link to={`/project/${item.id}`} className={classes.link} key={index}>
							<span>{item.name}</span>
							<span className={classes.taskCount}>{`${item.taskCount} task${item.taskCount === 1 ? '' : 's'}`}</span>
						</Link>
					)
				}
			</div>
		</Container>
	)
}
export default Projects