import { ComponentProps } from 'react';
import classes from './ErrorContent.module.scss';
import Container from '../../ui/Container/Container';
import { Link } from 'react-router-dom';

interface ErrorContentProps extends ComponentProps<'div'> {}

const ErrorContent = function({className = '', children, ...props}: ErrorContentProps) {

	return (
		<div className={`${className} ${classes.default}`} {...props}>
			<Container className={classes.container}>
				<span className={classes.big}>404</span>
				<span className={classes.small}>Project not found</span>
				<Link to='/' className={classes.link}>Go to projects list</Link>
			</Container>
		</div>
	)
}
export default ErrorContent