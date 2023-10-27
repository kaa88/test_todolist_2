import { useRef, useEffect, ReactNode } from 'react';
import './Slider.scss';
import { getCssVariable } from '../../../utilities/utilities';

declare global {
	namespace JSX {
		interface IntrinsicElements {
			'swiper-container': React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement> & {class?: string, init?: string}, HTMLElement>;
			'swiper-slide': React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement>;
		}
	}
}

let mobileBreakpoint = 0

interface SliderProps {
	direction?: 'horizontal' | 'vertical'
	className?: string
	containerClassName?: string
	controls?: string
	slideChageCallback?: (activeIndex: number) => void
	children: ReactNode
}

interface CustomSliderEvent {
	activeIndex?: number
}

const Slider = function({
	direction = 'horizontal',
	className = '',
	containerClassName = '',
	controls = '',
	slideChageCallback,
	children
}: SliderProps) {

	if (!mobileBreakpoint) mobileBreakpoint = getCssVariable('media-mobile')

	const isVertical = direction === 'vertical' ? true : false
	const swiperElRef = useRef(null)

	const handleSlideChange = (e: CustomSliderEvent) => {
		if (slideChageCallback && typeof e.activeIndex === 'number') slideChageCallback(e.activeIndex)
	}

	const swiperParams = {
		direction,
		freeMode: isVertical ? true : false,
		slidesPerView: isVertical ? 'auto' : 1,
		spaceBetween: isVertical ? 0 : 2,
		breakpoints: {
			[mobileBreakpoint]: {
				slidesPerView: 3,
				enabled: false
			},
		},
		on: {
			slideChangeTransitionEnd: handleSlideChange
		}
	}

	useEffect(() => {
		const swiperEl: any = swiperElRef.current
		if (swiperEl) {
			Object.assign(swiperEl, swiperParams)
			swiperEl.initialize()
		}
	}, [])


	return (
		<div className={`${className} swiper ${isVertical ? 'swiper-vertical' : 'swiper-horizontal'}`}>

			<swiper-container
				class={containerClassName}
				controller-control={controls}
				ref={swiperElRef}
				init="false"
			>
				{Array.isArray(children) && children.map((child, index) =>
					<swiper-slide key={index}>{child}</swiper-slide>
				)}
			</swiper-container>

		</div>
	)
}
export default Slider
