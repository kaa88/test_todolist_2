import { cloneElement, ChangeEvent, KeyboardEvent, useState, ReactElement, useEffect } from 'react';

export type InteractiveInputCallback = (value: string | number) => any

interface InteractiveInputProps {
	value: string
	children: ReactElement
	confirmCallback: InteractiveInputCallback
}

const InteractiveInput = function({value = '', confirmCallback, children}: InteractiveInputProps) {

	let [newValue, setNewValue] = useState<string | null>(null)
	if (newValue === null) setNewValue(value)
	let [isConfirmUpdate, setIsConfirmUpdate] = useState(false)


	function handleChange(e: ChangeEvent<HTMLTextAreaElement>) {
		setNewValue(e.target.value)
	}
	function handleKeyDown(e: KeyboardEvent<HTMLTextAreaElement>) {
		if (e.key === 'Enter' && !e.shiftKey) {
			e.preventDefault()
			setNewValue(newValue ? newValue.trimEnd() : newValue)
			e.currentTarget.blur()
		}
		if (e.key === 'Escape') {
			setNewValue(value)
			e.currentTarget.blur()
		}
	}
	function handleBlur() {
		setNewValue(prevState => {
			if (prevState === value) return prevState
			else return prevState ? prevState.trimEnd() : value
		})
		setIsConfirmUpdate(true)
	}
	useEffect(() => {
		if (isConfirmUpdate) {
			setIsConfirmUpdate(false)
			setNewValue(null)
			if (newValue !== value && newValue !== null) confirmCallback(newValue)
		}
	}, [isConfirmUpdate])

	if (!children) return null
	const {onChange, onKeyDown, onBlur} = children.props
	const newProps = {
		...children.props,
		value: newValue,
		onChange: onChange || handleChange,
		onKeyDown: onKeyDown || handleKeyDown,
		onBlur: onBlur || handleBlur,
	}
	const updatedChild = cloneElement(children, newProps)
	return updatedChild
}
export default InteractiveInput