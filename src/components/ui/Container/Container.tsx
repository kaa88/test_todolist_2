import type { ComponentPropsWithoutRef } from 'react';
import classes from './Container.module.scss';

interface ContainerProps extends ComponentPropsWithoutRef<'div'> {
	modif?: 'default' | 'flex'
}

function Container({
	modif = 'default',
	className = '',
	children,
	...props
}: ContainerProps) {
	
	return (
		<div className={`${className} ${classes[modif]}`} {...props}>
			{children}
		</div>
	)
}

export default Container