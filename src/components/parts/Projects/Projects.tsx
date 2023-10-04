import { ComponentPropsWithoutRef } from 'react';
import classes from './Projects.module.scss';
import { Link } from 'react-router-dom';
import { useAppSelector } from '../../../hooks/typedReduxHooks';
import Container from '../../ui/Container/Container';

interface ProjectsProps extends ComponentPropsWithoutRef<'div'> {}

const Projects = function({className = '', children, ...props}: ProjectsProps) {

	let {isLoading, loadError, list: projects, current} = useAppSelector(state => state.project)

	return (
		<Container modif="flex">
			<div className={`${className} ${classes.wrapper}`} {...props}>
				{isLoading && <p className={classes.loader}>LOADING</p>}
				{!!loadError
					? <p className={classes.error}>{loadError}</p>
					: projects?.map((item, index) =>
						<Link to={`/project/${item.id}`} className={classes.link} key={index}>{item.name}</Link>
					)
				}
			</div>
		</Container>
	)
}
export default Projects