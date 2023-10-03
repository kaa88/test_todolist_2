import { ComponentProps } from 'react';
import classes from './Todos.module.scss';

interface TodosProps extends ComponentProps<'div'> {
	project: number
}

const Todos = function({project, className = '', children, ...props}: TodosProps) {

	return (
		<div className={`${className} ${classes.default}`} {...props}>
			todos {project}
		</div>
	)
}
export default Todos