import { Link } from 'react-router-dom';
import Container from '../../components/ui/Container/Container';
// import TranslateHandler from '../../components/TranslateHandler';

function ErrorPage() {

	const styles = {
		container: {
			paddingTop: '50px',
			paddingBottom: '50px',
			display: 'flex',
			// flexDirection: 'column',
			justifyContent: 'center',
			alignItems: 'center',
		},
		title: {
			fontFamily: 'var(--font02)',
			fontSize: '76px',
		},
		subtitle: {
			fontSize: '20px',
		},
		link: {
			marginTop: '30px',
			textDecoration: 'underline',
			color: 'var(--color03)'
		},
	}

	return (
		<LiteLayout pageTitle='Page Not Found'>
			{/* <TranslateHandler> */}
				<Container style={styles.container}>
					<p style={styles.title}>404</p>
					<p style={styles.subtitle}>?_Page Not Found</p>
					<Link to='/' style={styles.link}>?_Go to Homepage</Link>
				</Container>
			{/* </TranslateHandler> */}
		</LiteLayout>
	)
}

export default ErrorPage