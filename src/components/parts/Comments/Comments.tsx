import { ComponentProps, useEffect, MouseEvent, useState, ChangeEvent, useRef } from 'react';
import classes from './Comments.module.scss';
import { IComment, Id } from '../../../types/types';
import { useAppDispatch, useAppSelector } from '../../../hooks/typedReduxHooks';
import { createComment, updateComment, updateCommentList } from '../../../store/reducers/commentReducer';
import { DateService } from '../../../services/DateService';
import Icon from '../../ui/Icon/Icon';
import AutoResizeTextarea from '../../ui/AutoResizeTextarea/AutoResizeTextarea';
import { getCssVariable } from '../../../utilities/utilities';
import { error } from 'console';

interface CommentsProps extends ComponentProps<'div'> {
	taskId: Id
}

const dateFormat = 'DD.MM.YYYY HH:mm'
let newCommentAnimationDuration = 0 // required for smooth animation
const newCommentAnimationDurationDelay = 50 // required for proper height calculation

const Comments = function({className = '', taskId, ...props}: CommentsProps) {
	newCommentAnimationDuration = getCssVariable('timer-new-comment') * 1000

	const dispatch = useAppDispatch()

	let {isLoading, loadError, list: comments} = useAppSelector(state => state.comments)

	useEffect(() => {
		dispatch(updateCommentList(taskId))
	}, [taskId])

	let [activeNewCommentForm, setActiveNewCommentForm] = useState<Id | null | undefined>(undefined)

	const showNewCommentForm = (e: MouseEvent<HTMLButtonElement>) => {
		let id = e.currentTarget.dataset.id
		let target = id ? Number(id) : null
		setActiveNewCommentForm(target)
	}
	const hideNewCommentForm = () => {
		setActiveNewCommentForm(undefined)
	}
	const addComment: NewCommentCallback = (comment) => {
		if (!comment) return;
		const fullComment = {
			...comment,
			id: 0,
			taskId,
			subcomments: [],
			rating: 0
		}
		dispatch(createComment(fullComment))
		hideNewCommentForm()
	}
	const likeComment = (e: MouseEvent<HTMLButtonElement>) => {
		let id = Number(e.currentTarget.dataset.id)
		if (isNaN(id)) return;
		let currentComment = comments.find(com => com.id === id)
		if (currentComment) dispatch(updateComment({...currentComment, rating: currentComment.rating + 1}))
	}

	const sortList = (list: IComment[]) => list.sort((a,b) => b.date - a.date)

	const getComments = (IDs?: Id[]) => {
		let list: IComment[] = []
		if (IDs) list = comments.filter(com => IDs.includes(com.id))
		else list = comments.filter(com => !com.isSub)
		sortList(list)
		return list.map((com, index) =>
			// let key = Date.now() + index
			// !!! не работает повышение рейтинга у новых комментов
			<div className={classes.comment} key={Date.now() + index}>

				<div className={classes.main}>
					<div className={classes.actions}>
						<button className={classes.ratingButton} onClick={likeComment} data-id={com.id} title='like'>
							<Icon name='icon-like' />
							<span>{com.rating}</span>
						</button>
						<button className={classes.addCommentButton} onClick={showNewCommentForm} data-id={com.id} title='add comment'>
							<Icon name='icon-arrow-short' />
						</button>
					</div>
					<div className={classes.content}>
						<p className={classes.author}>{com.author}</p>
						<p className={classes.date}>{DateService.getDate(com.date, dateFormat)}</p>
						<p className={classes.text}>{com.content}</p>
					</div>
				</div>

				<NewComment
					className={classes.newComment}
					isActive={activeNewCommentForm === com.id ? true : false}
					parentID={com.id}
					createCallback={addComment}
					cancelCallback={hideNewCommentForm}
				/>

				{!!com.subcomments.length &&
					<div className={classes.subcomments}>
						{getComments(com.subcomments)}
					</div>
				}

			</div>
		)}

	return (
		<div className={`${className} ${classes.wrapper}`} {...props}>
			<p>{`${isLoading ? 'LOADING' : ''} ${loadError ? loadError : ''}`}</p>

			<div className={classes.header}>
				<button className={classes.addCommentButtonBig} onClick={showNewCommentForm}>
					<Icon name='icon-cross-bold' />
					<span>Add comment</span>
				</button>
				<NewComment
					className={classes.newComment}
					isActive={activeNewCommentForm === null ? true : false}
					parentID={null}
					createCallback={addComment}
					cancelCallback={hideNewCommentForm}
				/>
			</div>

			<div className={classes.comments}>
				{getComments()}
			</div>

		</div>
	)
}
export default Comments





interface INewComment {
	date: number
	author: string
	content: string
	isSub: boolean
}
type NewCommentCallback = (comment: INewComment) => void
type CancelNewCommentCallback = (parentID: Id | null) => void

interface NewCommentProps extends ComponentProps<'div'> {
	isActive: boolean
	parentID: Id | null
	createCallback?: NewCommentCallback
	cancelCallback?: CancelNewCommentCallback
}

const NewComment = function({
	isActive,
	parentID,
	createCallback,
	cancelCallback,
	className = '',
	...props
}: NewCommentProps) {

	// Wrapper Height
	// The following code is only to make 'NewComment form' appear and disappear with animation. The main problem was to make it work even after wrapper height was changed. Behold!
	// So there are several stages of renders: calculating wrapper height, applying changes and running animation
	const wrapperRef = useRef<HTMLDivElement>(null)
	const defaultWrapperHeight = '0'
	let [wrapperHeight, setWrapperHeight] = useState(defaultWrapperHeight)
	let [isWrapperVisible, setWrapperIsVisible] = useState(false)
	let [isApplyChanges, setIsApplyChanges] = useState(false)

	const showWrapper = () => {
		if (isActive && !isWrapperVisible) {
			setWrapperIsVisible(true)
			setIsApplyChanges(true)
		}
	}
	showWrapper()
	const hideWrapper = () => {
		let wrapperEl = wrapperRef.current
		if (wrapperEl) setWrapperHeight(wrapperEl.offsetHeight + 'px')
		setIsApplyChanges(true)
		setTimeout(() => {
			setWrapperIsVisible(false)
		}, newCommentAnimationDuration)
	}

	useEffect(() => {
		if (isApplyChanges) {
			setIsApplyChanges(false)
			if (wrapperHeight === defaultWrapperHeight) {
				const wrapperEl = wrapperRef.current
				setTimeout(() => {
					if (wrapperEl) setWrapperHeight(wrapperEl.offsetHeight + 'px')
				}, newCommentAnimationDurationDelay)
			}
			else {
				setWrapperHeight(defaultWrapperHeight)
				setTimeout(() => clearFields(), newCommentAnimationDuration)
			}
		}
	}, [isApplyChanges])
	// /Wrapper Height


	let [author, setAuthor] = useState('')
	let [authorError, setAuthorError] = useState(false)
	let [text, setText] = useState('')
	let [textError, setTextError] = useState(false)

	const handleAuthorChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
		setAuthor(e.target.value)
		setAuthorError(false)
		setWrapperHeight('auto') // this provides to change height while typing (e.g. in case I use 'AutoResizeTextarea')
	}
	const handleTextChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
		setText(e.target.value)
		setTextError(false)
		setWrapperHeight('auto')
	}

	const clearFields = () => {
		setAuthor('')
		setText('')
	}
	const createComment = () => {
		if (!author || !text) {
			if (!author) setAuthorError(true)
			if (!text) setTextError(true)
			return
		}
		if (createCallback) {
			const comment: INewComment = {
				date: Date.now(),
				author,
				content: text,
				isSub: typeof parentID === 'number' ? true : false
			}
			createCallback(comment)
		}
		hideWrapper()
	}
	const cancelCreation = () => {
		if (cancelCallback) cancelCallback(parentID)
		hideWrapper()
	}


	return (
		<div className={`${className} ${classes.newCommentContainer}`} style={{height: wrapperHeight}} {...props}>
			{isWrapperVisible &&
				<div className={classes.newCommentWrapper} ref={wrapperRef}>
					<div className={classes.newCommentMain}>
						<p className={classes.newCommentTitle}>Author:</p>
						<AutoResizeTextarea
							className={`${classes.inputAuthor} ${authorError ? classes.inputError : ''}`}
							value={author}
							onChange={handleAuthorChange}
						/>
						<p className={classes.newCommentTitle}>Your comment:</p>
						<AutoResizeTextarea
							className={`${classes.inputText} ${textError ? classes.inputError : ''}`}
							value={text}
							onChange={handleTextChange}
						/>
					</div>
					<div className={classes.newCommentButtons}>
						<button className={classes.confirmButton} onClick={createComment} title='confirm'>
							<Icon name='icon-ok' />
						</button>
						<button className={classes.cancelButton} onClick={cancelCreation} title='cancel'>
							<Icon name='icon-cross-bold' />
						</button>
					</div>
				</div>
			}
		</div>
	)
}
