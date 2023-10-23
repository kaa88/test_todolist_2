import { ComponentProps } from 'react';
import Icon from '../Icon/Icon';
import classes from './Loader.module.scss';

interface LoadErrorProps extends ComponentProps<'div'> {
	variant?: 'dark' | 'light'
	message: string
}

const LoadError = function({variant = 'dark', className = '', message, ...props}: LoadErrorProps) {

	return (
		<div className={`${className} ${classes[variant]}`} {...props}>
		<Icon className={classes.errIcon} name='icon-cross' />
		<p className={classes.errMsg}>{message}</p>
	</div>
)
}
export default LoadError
