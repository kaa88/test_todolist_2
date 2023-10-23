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


	const getNewCommentForm = (parentId: ParentID) =>
		<div className={classes.newCommentContainer}>
			<NewComment
				className={classes.newComment}
				parentId={parentId}
				createCallback={addComment}
				cancelCallback={hideNewCommentForm}
			/>
		</div>

	const sortList = (list: IComment[]) => list.sort((a,b) => b.date - a.date)

	const getComments = (parentId?: ParentID) => {
		if (parentId === undefined) parentId = null
		const list = comments.filter(com => com.parentId === parentId)
		if (!list.length) return null
		sortList(list)

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
type CancelNewCommentCallback = (parentId: Id | null) => void

interface NewCommentProps extends ComponentProps<'div'> {
	parentId: ParentID
	createCallback?: NewCommentCallback
	cancelCallback?: CancelNewCommentCallback
}

const NewComment = function({
	parentId,
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
				parentId
			}
			createCallback(comment)
		}
		clearFields()
	}
	const cancelCreation = () => {
		if (cancelCallback) cancelCallback(parentId)
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
