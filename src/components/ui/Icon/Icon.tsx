import type { ComponentPropsWithoutRef } from 'react';
import classes from './Icon.module.scss';
import iconSprite from './sprite.svg';

interface IconProps extends ComponentPropsWithoutRef<'svg'> {
	name: string
	size?: string // eg '20px'
	children?: undefined
}

const Icon = function({
	className = '',
	name,
	size,
	style = {},
	...props
}: IconProps) {

	const path = `${iconSprite}#${name}`
	if (size) style.width = style.height = size;
	return (
		<svg
			className={`${className} ${classes.svg}`}
			name={name}
			style={style}
			{...props}
		>
			<use href={path}></use>
		</svg>
	)
}

export default Icon