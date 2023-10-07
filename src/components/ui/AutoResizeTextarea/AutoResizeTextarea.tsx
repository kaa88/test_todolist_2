import { ComponentProps, useEffect, KeyboardEvent, ChangeEvent, useState, useRef } from 'react';
import classes from './AutoResizeTextarea.module.scss';

interface TextareaProps extends ComponentProps<'div'> {
	content?: string
	basicHeight?: number
	callback: (value: string) => void
	isCreate?: boolean
}

const AutoResizeTextarea = function({content = '', basicHeight = 22, callback, isCreate = false, className = ''}: TextareaProps) {

	let [elemHeight, setElemHeight] = useState(basicHeight)
	const fakeElRef = useRef<HTMLTextAreaElement>(null)
	useEffect(() => {
		const fakeEl = fakeElRef.current
		if (fakeEl && fakeEl.scrollHeight !== elemHeight) setElemHeight(fakeEl.scrollHeight)
	})

	let [value, setValue] = useState(content)

	function handleInputChange(e: ChangeEvent<HTMLTextAreaElement>) {
		setValue(e.target.value)
	}
	function handleKeyDown(e: KeyboardEvent<HTMLTextAreaElement>) {
		if (e.key === 'Enter' || e.key === 'Escape') e.currentTarget.blur()
		if (isCreate) { //?
			e.preventDefault()
			e.currentTarget.focus()
		}
	}
	function updateTask() {
		if (value !== content) callback(value)
	}

	return (
		<div className={`${className} ${classes.box}`}>
			<textarea
				className={classes.input}
				style={{height: elemHeight + 'px', lineHeight: basicHeight + 'px'}}
				value={value}
				onChange={handleInputChange}
				onKeyDown={handleKeyDown}
				onBlur={updateTask}
			></textarea>
			<textarea
				className={classes.fakeInput}
				style={{height: basicHeight + 'px', lineHeight: basicHeight + 'px'}}
				value={value}
				ref={fakeElRef}
				tabIndex={-1}
				readOnly
			></textarea>
		</div>
	)
}
export default AutoResizeTextarea