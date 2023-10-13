// NOTE:

import { ComponentProps, useLayoutEffect, useState, useRef } from 'react';
import classes from './AutoResizeTextarea.module.scss';

interface AutoResizeTextareaProps extends ComponentProps<'textarea'> {
	wrapperClassName?: string
}

const basicHeightCssVariableName = '--basic-height'

const AutoResizeTextarea = function({value = '', className = '', wrapperClassName = '', ...props}: AutoResizeTextareaProps) {

	let [basicHeight, setBasicHeight] = useState(0)
	let [currentHeight, setCurrentHeight] = useState(0)
	let [borders, setBorders] = useState(0)
	const fakeElRef = useRef<HTMLTextAreaElement>(null)

	useLayoutEffect(() => {
		let height = 0
		let borderTopWidth = 0
		let borderBottomWidth = 0
			const fakeEl = fakeElRef.current
		if (fakeEl) {
			height = parseFloat(getComputedStyle(fakeEl).getPropertyValue(basicHeightCssVariableName))
			borderTopWidth = parseFloat(getComputedStyle(fakeEl).borderTopWidth)
			borderBottomWidth = parseFloat(getComputedStyle(fakeEl).borderBottomWidth)
		}
		setBasicHeight(height)
		setCurrentHeight(height)
		setBorders(borderTopWidth + borderBottomWidth)

		window.addEventListener('resize', calcHeight)
		return () => window.removeEventListener('resize', calcHeight)
	}, [])
	useLayoutEffect(() => {
		calcHeight()
	})

	function calcHeight() {
		const fakeEl = fakeElRef.current
		if (fakeEl && fakeEl.scrollHeight + borders !== currentHeight)
			setCurrentHeight(fakeEl.scrollHeight + borders)
	}

	return (
		<>
		<div className={`${wrapperClassName} ${classes.wrapper}`}>
			<textarea
				className={`${className} ${classes.input}`}
				style={{height: currentHeight + 'px'}}
				value={value}
				{...props}
			/>
			<textarea
				className={`${className} ${classes.fakeInput}`}
				style={{height: basicHeight + 'px'}}
				value={value}
				ref={fakeElRef}
				tabIndex={-1}
				readOnly
			/>
		</div>
		</>
	)
}
export default AutoResizeTextarea