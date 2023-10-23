import type { ComponentPropsWithoutRef } from 'react';
import classes from './Button.module.scss';

interface ButtonProps extends ComponentPropsWithoutRef<'button'> {
	variant?: 'default' | 'negative'
}

const Button = function({
	className = '',
	variant = 'default',
	children = 'button',
	...props
}: ButtonProps) {

	return (
		<button className={`${className} ${classes[variant]}`} {...props}>
			{children}
		</button>
	)
}

export default Button