import { ComponentProps, memo } from 'react';
import classes from './Footer.module.scss';
import Container from '../../ui/Container/Container';

interface FooterProps extends ComponentProps<'footer'> {
	children?: undefined
	project?: string
	tasksCount?: number
}

const Footer = memo(function({project = '', tasksCount = 0, className = '', ...props}: FooterProps) {

	return (
		<footer className={`${className} ${classes.footer}`} {...props}>
			<Container className={classes.container}>
				<p className={classes.footerItem}>
					{`Project: ${project}`}
				</p>
				<p className={classes.footerItem}>
					{`Total tasks: ${tasksCount}`}
				</p>
			</Container>
		</footer>
)
})
export default Footer