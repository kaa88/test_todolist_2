// import Banner from '../../components/parts/Banner/Banner';
// import Cars from '../../components/parts/Cars/Cars';
// import Faq from '../../components/parts/Faq/Faq';
// import Feedback from '../../components/parts/Feedback/Feedback';
// import DefaultLayout from '../layouts/DefaultLayout';

import Button from "../../components/ui/Button/Button"
import Icon from "../../components/ui/Icon/Icon"

function HomePage() {

	return (
		<div style={{height: '100%', width: '500px', background: '#eee'}}>
			<p style={{fontSize: '30px'}}>Montserrat</p>
			<Button
				// modif='dark'
				className="class-name"
				onClick={()=>console.log('click')}
				style={{color: 'red'}}
				type="button"
			>Text</Button>
			<Button><Icon name="icon-email" onClick={()=>console.log('click')} /></Button>
			{/* <Icon name="s">icon</Icon> */}
		</div>
		// <DefaultLayout>
		// 	<Banner />
		// 	<Cars />
		// 	<Faq />
		// 	<Feedback />
		// </DefaultLayout>
	)
}

export default HomePage