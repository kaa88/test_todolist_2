import { ComponentProps, useEffect, useState } from 'react';
import classes from './Projects.module.scss';
import { useFetching } from '../../../hooks/useFetching';
import { projectService } from '../../../services/projectService';
import { IProject } from '../../../types/types';
import { Link } from 'react-router-dom';
import { useAppSelector } from '../../../hooks/typedReduxHooks';

interface ProjectsProps extends ComponentProps<'div'> {}

const Projects = function({className = '', children, ...props}: ProjectsProps) {

	let projects = useAppSelector(state => state.project.list)

	// let [projects, setProjects] = useState<IProject[]>()

	// const getProjects = async () => {
	// 	let projects = await projectService.getProjects()
	// 	setProjects(projects)
	// }

	// let {fetch, isLoading, error} = useFetching(getProjects)

	// useEffect(() => {
	// 	fetch()
	// }, []) // eslint-disable-line react-hooks/exhaustive-deps

	return (
		<div className={`${className} ${classes.wrapper}`} {...props}>
			{isLoading && <p className={classes.loader}>LOADING</p>}
			{!!error
				? <p className={classes.error}>{error}</p>
				: projects?.map((item, index) =>
					<Link to={`/project/${item.id}`} className={classes.link} key={index}>{item.name}</Link>
				)
			}
		</div>
	)
}
export default Projects