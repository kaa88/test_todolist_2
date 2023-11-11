import { ComponentProps, useEffect, MouseEvent, useState, ChangeEvent } from 'react';
import classes from './Comments.module.scss';
import { IComment, INewComment, Id } from '../../../types/types';
import { useAppDispatch, useAppSelector } from '../../../hooks/typedReduxHooks';
import { createComment, updateComment, updateCommentList } from '../../../store/reducers/commentReducer';
import { DateService } from '../../../services/DateService';
import Icon from '../../ui/Icon/Icon';
import AutoResizeTextarea from '../../ui/AutoResizeTextarea/AutoResizeTextarea';
import Loader from '../../ui/Loader/Loader';
import LoadError from '../../ui/Loader/LoadError';
import Button from '../../ui/Button/Button';

interface CommentsProps extends ComponentProps<'div'> {
	taskId: Id
}

const dateFormat = 'DD.MM.YYYY HH:mm'

const Comments = function({className = '', taskId, ...props}: CommentsProps) {

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
			id: 0, // random number id, because server will change it
			taskId,
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


	const getNewCommentForm = (parentCommentId: ParentID) =>
		<div className={classes.newCommentContainer}>
			<NewComment
				className={classes.newComment}
				parentCommentId={parentCommentId}
				createCallback={addComment}
				cancelCallback={hideNewCommentForm}
			/>
		</div>

	const sortList = (list: IComment[], asc: boolean) => list.sort((a,b) => asc ? b.date - a.date : a.date - b.date)

	const getComments = (parentCommentId?: ParentID) => {
		if (parentCommentId === undefined) parentCommentId = null
		const list = comments.filter(com => com.parentCommentId === parentCommentId)
		if (!list.length) return null
		const isNewFirst = parentCommentId ? false : true
		sortList(list, isNewFirst)

		return list.map((com, index) => {
			const subcomments = getComments(com.id)
			return (
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

					{activeNewCommentForm === com.id && getNewCommentForm(com.id)}

					{!!subcomments &&
						<div className={classes.subcomments}>
							{subcomments}
						</div>
					}

				</div>
			)}
		)}

	return (
		<div className={`${className} ${classes.wrapper}`} {...props}>
			{isLoading && <Loader className={classes.loader} />}
			{!!loadError && <LoadError className={classes.loadError} message={loadError} />}

			<div className={classes.header}>
				<Button className={classes.addCommentButtonBig} variant='negative' onClick={showNewCommentForm}>
					<Icon name='icon-cross-bold' />
					<span>Add comment</span>
					</Button>
				{activeNewCommentForm === null && getNewCommentForm(null)}
			</div>

			<div className={classes.comments}>
				{getComments()}
			</div>

		</div>
	)
}
export default Comments





type ParentID = Id | null
type NewCommentCallback = (comment: INewComment) => void
type CancelNewCommentCallback = (parentCommentId: Id | null) => void

interface NewCommentProps extends ComponentProps<'div'> {
	parentCommentId: ParentID
	createCallback?: NewCommentCallback
	cancelCallback?: CancelNewCommentCallback
}

const NewComment = function({
	parentCommentId,
	createCallback,
	cancelCallback,
	className = '',
	...props
}: NewCommentProps) {

	let [author, setAuthor] = useState('')
	let [authorError, setAuthorError] = useState(false)
	let [text, setText] = useState('')
	let [textError, setTextError] = useState(false)

	const handleAuthorChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
		setAuthor(e.target.value)
		setAuthorError(false)
	}
	const handleTextChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
		setText(e.target.value)
		setTextError(false)
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
				parentCommentId
			}
			createCallback(comment)
		}
		clearFields()
	}
	const cancelCreation = () => {
		if (cancelCallback) cancelCallback(parentCommentId)
		clearFields()
	}

	return (
		<div className={`${className} ${classes.newCommentWrapper}`} {...props}>
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
	)
}
