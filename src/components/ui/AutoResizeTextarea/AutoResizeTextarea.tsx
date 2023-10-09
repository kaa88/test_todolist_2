import { ComponentProps, useLayoutEffect, useState, useRef } from 'react';
import classes from './AutoResizeTextarea.module.scss';

const basicHeightCssVariableName = '--basic-height'

const AutoResizeTextarea = function({value = '', className = '', ...props}: ComponentProps<'textarea'>) {

	let [basicHeight, setBasicHeight] = useState(0)
	let [currentHeight, setCurrentHeight] = useState(0)
	const fakeElRef = useRef<HTMLTextAreaElement>(null)
	useLayoutEffect(() => {
		let height = 0
		const fakeEl = fakeElRef.current
		if (fakeEl) height = parseFloat(getComputedStyle(fakeEl).getPropertyValue(basicHeightCssVariableName))
		setBasicHeight(height)
		setCurrentHeight(height)
	}, [])
	useLayoutEffect(() => {
		const fakeEl = fakeElRef.current
		if (fakeEl && fakeEl.scrollHeight !== currentHeight) setCurrentHeight(fakeEl.scrollHeight)
	})

	return (
		<div className={`${className} ${classes.box}`}>
			<textarea
				className={classes.input}
				style={{height: currentHeight + 'px'}}
				value={value}
				{...props}
			></textarea>
			<textarea
				className={classes.fakeInput}
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