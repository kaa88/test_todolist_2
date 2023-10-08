import { ComponentProps, useEffect, KeyboardEvent, ChangeEvent, FocusEvent, useState, useRef } from 'react';
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
	let [isComfirm, setIsConfirm] = useState(false)

	function handleChange(e: ChangeEvent<HTMLTextAreaElement>) {
		setValue(e.target.value)
	}
	function handleKeyDown(e: KeyboardEvent<HTMLTextAreaElement>) {
		if (e.key === 'Enter') {
			e.preventDefault()
			if (value === content) return;
			setIsConfirm(true)
			if (!isCreate) e.currentTarget.blur()
		}
		if (e.key === 'Escape') {
			setValue(content)
			e.currentTarget.blur()
		}
	}
	function handleBlur() {
		if (!isCreate && value !== content) setIsConfirm(true)
	}
	useEffect(() => {
		if (isComfirm) {
			let trimmedValue = value.trimEnd()
			if (trimmedValue !== content) callback(trimmedValue)
			setValue(isCreate ? '' : trimmedValue)
			setIsConfirm(false)
		}
	}, [isComfirm])

	return (
		<div className={`${className} ${classes.box}`}>
			<textarea
				className={classes.input}
				style={{height: elemHeight + 'px', lineHeight: basicHeight + 'px'}}
				value={value}
				onChange={handleChange}
				onKeyDown={handleKeyDown}
				onBlur={handleBlur}
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