import { ComponentProps } from 'react';
import classes from './ErrorContent.module.scss';
import Container from '../../ui/Container/Container';

interface ErrorContentProps extends ComponentProps<'div'> {}

const ErrorContent = function({className = '', children, ...props}: ErrorContentProps) {

	return (
		<Container>
			<div className={`${className} ${classes.default}`} {...props}>
				404
			</div>
		</Container>
	)
}
export default ErrorContent