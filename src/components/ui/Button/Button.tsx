import type { ComponentPropsWithoutRef } from 'react';
import classes from './Button.module.scss';

interface ButtonProps extends ComponentPropsWithoutRef<'button'> {
	modif?: 'default' | 'negative'
}

const Button = function({
	className = '',
	modif = 'default',
	children = 'button',
	...props
}: ButtonProps) {

	return (
		<button className={`${className} ${classes[modif]}`} {...props}>
			{children}
		</button>
	)
}

export default Button