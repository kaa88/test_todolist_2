import { ComponentProps, useLayoutEffect, useState, useRef } from 'react';
import classes from './AutoResizeTextarea.module.scss';

const basicHeightCssVariableName = '--basic-height'

const AutoResizeTextarea = function({value = '', className = '', style, ...props}: ComponentProps<'textarea'>) {

	let [basicHeight, setBasicHeight] = useState(0)
	let [currentHeight, setCurrentHeight] = useState(0)
	const fakeElRef = useRef<HTMLTextAreaElement>(null)

	console.log(value, currentHeight)

	useLayoutEffect(() => {
		let height = 0
		const fakeEl = fakeElRef.current
		if (fakeEl) height = parseFloat(getComputedStyle(fakeEl).getPropertyValue(basicHeightCssVariableName))
		console.log(height)
		setBasicHeight(height)
		setCurrentHeight(height)

		window.addEventListener('resize', calcHeight)
		return () => window.removeEventListener('resize', calcHeight)
	}, [])
	useLayoutEffect(() => {
		calcHeight()
	})

	function calcHeight() {
		const fakeEl = fakeElRef.current
		if (fakeEl && fakeEl.scrollHeight !== currentHeight)
			setCurrentHeight(fakeEl.scrollHeight)
	}

	return (
		<div className={`${classes.box}`} style={style}>
			<textarea
				className={`${className} ${classes.input}`}
				style={{height: currentHeight + 'px'}}
				value={value}
				{...props}
			></textarea>
			<textarea
				className={`${className} ${classes.fakeInput}`}
				style={{height: basicHeight + 'px'}}
				value={value}
				ref={fakeElRef}
				tabIndex={-1}
				readOnly
			></textarea>
		</div>
	)
}
export default AutoResizeTextarea