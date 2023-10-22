import { ComponentProps } from 'react';
import classes from './Logo.module.scss';
import { Link } from 'react-router-dom';

interface LogoProps extends ComponentProps<'a'> {}

const Logo = function({className = ''}: LogoProps) {

	return (
		<Link to='/' className={`${className} ${classes.default}`}>
			<span className={classes.big}>todo</span>
			<span className={classes.small}>list</span>
		</Link>
	)
}
export default Logo