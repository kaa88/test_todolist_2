import { ComponentProps, useEffect, useRef, useState } from 'react';
import classes from './Modal.module.scss';
import { getCssVariable } from '../../../utilities/utilities';
import { useAppDispatch, useAppSelector } from '../../../hooks/typedReduxHooks';
import { lockScroll, unlockScroll } from '../../../utilities/scrollLock';
import { transitionIsLocked } from '../../../utilities/transitionLock';
import { setActiveModal } from '../../../store/reducers/modalReducer';
import Icon from '../Icon/Icon';

const timeout = getCssVariable('timer-modal') * 1000

const Modal = function({className = ''}: ComponentProps<'div'>) {

	const dispatch = useAppDispatch()
	const modalStore = useAppSelector(state => state.modal)

	const defaultModal = {
		isActive: false,
		name: '',
		content: '',
	}
	let [modal, setModal] = useState(defaultModal)

	useEffect(() => {
		if (modalStore.active) openModal()
		else closeModal(null, true)
	}, [modalStore]) // eslint-disable-line react-hooks/exhaustive-deps

	const contentRef = useRef<HTMLDivElement>(null)

	function openModal() {
		lockScroll()
		setModal({
			isActive: true,
			name: modalStore.active,
			content: modalStore.content || getStaticContent()
		})
		if (contentRef.current) contentRef.current.scrollTo({top: 0})
	}
	function closeModal(e?: React.MouseEvent | null, linkEvent?: boolean) {
		if (!linkEvent && transitionIsLocked(timeout)) return;
		unlockScroll(timeout)
		dispatch(setActiveModal(''))
		setModal({...modal, isActive: false})
		setTimeout(() => {
			setModal(defaultModal)
		}, timeout)
	}

	function getStaticContent() {
		// if (modalStore.content) return modalStore.content
		// if (Object.keys(staticNames).includes(modalStore.active))
		// 	return <ModalStaticContent name={modalStore.active}/>
	}

	// useEffect(() => {
		// scriptManager.registerFunctions('modal', {close: closeModal.bind(null, null, true)})
	// }, []) // eslint-disable-line react-hooks/exhaustive-deps
	
	return (
		// <TranslateHandler>
			<div className={`${className} ${classes.default} ${modal.isActive ? classes.active : ''}`} data-name={modal.name}>
				<div className={classes.closeArea} onClick={closeModal}></div>
				<div className={classes.wrapper}>
					<div className={classes.closeButton} onClick={closeModal}>
						<Icon name='icon-cross' />
					</div>
					<div className={classes.content} ref={contentRef}>
						{modal.content}
					</div>
				</div>
			</div>
		// </TranslateHandler>
	)
}
export default Modal

