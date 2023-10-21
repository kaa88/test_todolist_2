import { ComponentProps, useEffect, useState, MouseEvent, cloneElement, ReactElement } from 'react';
import { createPortal } from 'react-dom';
import classes from './Modal.module.scss';
import { getCssVariable } from '../../../utilities/utilities';
// import { lockScroll, unlockScroll } from '../../../utilities/scrollLock';
import Icon from '../Icon/Icon';
import { transitionIsLocked } from '../../../utilities/transitionLock';
import { useAppSelector } from '../../../hooks/typedReduxHooks';

interface ModalProps extends ComponentProps<'div'> {
	variant?: 'default'
	isActive: boolean
	onClose: () => void
}

const modalContainerEl = document.getElementById('modal')
let timeout = 0


export const Modal = function({variant = 'default', className = '', children, isActive, onClose}: ModalProps) {

	if (!timeout) timeout = getCssVariable('timer-modal') * 1000

	let modalCloseTrigger = useAppSelector(state => state.modal.closeTrigger)
	useEffect(() => onClose(), [modalCloseTrigger])

	let [isContentVisible, setIsContentVisible] = useState(false)

	useEffect(() => {
		if (isActive) {
			// lockScroll()
			setIsContentVisible(true)
		}
		else {
			// unlockScroll(timeout)
			setTimeout(() => {
				setIsContentVisible(false)
			}, timeout)
		}
	}, [isActive])
	

	const closeModal = () => {
		if (!transitionIsLocked(timeout)) onClose()
	}

	if (!modalContainerEl) {
		console.error('Modal container not found')
		return null
	}

	const modal =
		<div className={`${className} ${classes[variant]} ${isActive ? classes.active : ''}`}>
			{isContentVisible && <>
				<div className={classes.closeArea} onClick={closeModal}></div>
				<div className={classes.wrapper}>
					<div className={classes.closeButton} onClick={closeModal}>
						<Icon name='icon-cross' />
					</div>
					<div className={classes.content}>
						{children}
					</div>
				</div>
			</>}
		</div>

	return createPortal(modal, modalContainerEl)
}



interface ModalLinkProps extends ComponentProps<'div'> {
	children: ReactElement
}

export const ModalLink = function({children}: ModalLinkProps) {

	const toggleModal = (e: MouseEvent<HTMLInputElement | HTMLButtonElement>) => {
		if (transitionIsLocked(timeout)) return;
		if (children?.props?.onClick) children.props.onClick(e)
	}
	const newProps = {...children.props, onClick: toggleModal}
	const updatedChild = cloneElement(children, newProps)
	return updatedChild
}
