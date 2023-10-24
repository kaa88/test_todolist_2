import { useRef, useEffect } from 'react';
import './Slider.scss';
import { getCssVariable } from '../../../utilities/utilities';

let mobileBreakpoint = 0

const Slider = function({className = '', children}) {

	if (!mobileBreakpoint) mobileBreakpoint = getCssVariable('media-mobile')

	const swiperElRef = useRef(null);

	const swiperParams = {
		slidesPerView: 1,
		spaceBetween: 2,
		breakpoints: {
			[mobileBreakpoint]: {
				slidesPerView: 3,
				enabled: false
			},
		},
	};

	useEffect(() => {
		const swiperEl = swiperElRef.current
		if (swiperEl) {
			Object.assign(swiperEl, swiperParams)
			swiperEl.initialize()
		}
	}, [])
	

	return (
		<div className={`${className} swiper`}>

			<div className="swiper-pagination"></div>

			<swiper-container ref={swiperElRef} init="false">
				{children.map((child, index) =>
					<swiper-slide key={index}>{child}</swiper-slide>
				)}
			</swiper-container>

		</div>
	)
}
export default Slider
