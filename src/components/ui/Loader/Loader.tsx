import { ComponentProps } from 'react';
import Icon from '../Icon/Icon';
import classes from './Loader.module.scss';

interface LoaderProps extends ComponentProps<'div'> {
	modif?: 'dark' | 'light'
}

const Loader = function({modif = 'dark', className = '', ...props}: LoaderProps) {

	return (
		<div className={`${className} ${classes[modif]}`} {...props}>
			<Icon className={classes.loadIcon} name='icon-spinner' />
		</div>
	)
}
export default Loader
