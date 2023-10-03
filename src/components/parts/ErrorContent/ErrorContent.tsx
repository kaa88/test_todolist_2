import { ComponentProps } from 'react';
import classes from './ErrorContent.module.scss';

interface ErrorContentProps extends ComponentProps<'div'> {}

const ErrorContent = function({className = '', children, ...props}: ErrorContentProps) {

	return (
		<div className={`${className} ${classes.default}`} {...props}>
			404
		</div>
	)
}
export default ErrorContent