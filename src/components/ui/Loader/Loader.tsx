import { ComponentProps } from 'react';
import Icon from '../Icon/Icon';
import classes from './Loader.module.scss';

interface LoaderProps extends ComponentProps<'div'> {
	variant?: 'dark' | 'light'
}

const Loader = function({variant = 'dark', className = '', ...props}: LoaderProps) {

	return (
		<div className={`${className} ${classes[variant]}`} {...props}>
			<Icon className={classes.loadIcon} name='icon-spinner' />
		</div>
	)
}
export default Loader
