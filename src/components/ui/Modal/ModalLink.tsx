import { ComponentProps, ReactElement, cloneElement, useEffect } from 'react';
import { getCssVariable } from '../../../utilities/utilities';
import { transitionIsLocked } from '../../../utilities/transitionLock';
import { useAppDispatch } from '../../../hooks/typedReduxHooks';
import { setActiveModal } from '../../../store/reducers/modalReducer';

interface ModalLinkProps extends ComponentProps<'div'> {
	name?: string
	content?: any
	children?: ReactElement
	onOpen?: (...args: any) => any
}

let timeout = 0


const ModalLink = function({name = '', content, children, onOpen}: ModalLinkProps) {

	const dispatch = useAppDispatch()
	
	useEffect(() => {
		if (!timeout) timeout = getCssVariable('timer-modal') * 1000
	}, []) // eslint-disable-line react-hooks/exhaustive-deps
	
	if (!children) return null

	function getContent() {
		if (name) {
			if (content) {
				if (typeof content === 'function') return content()
				else return content
			}
			// else return <ModalStaticContent name={name} />
		}
		else return null
	}
	function showModal(e: Event) {
		if (transitionIsLocked(timeout)) return;
		dispatch(setActiveModal({name, content: getContent()}))
		if (children?.props?.onClick) children.props.onClick(e)
		if (onOpen) onOpen()
	}

	const newProps = {...children.props, onClick: showModal}
	const updatedChild = cloneElement(children, newProps)

	return updatedChild
}
export default ModalLink
