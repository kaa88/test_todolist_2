import { ChangeEvent, ComponentProps, useState, useEffect } from 'react';
import classes from './Attachments.module.scss';
import Icon from '../../ui/Icon/Icon';
import { useAppDispatch, useAppSelector } from '../../../hooks/typedReduxHooks';
import { createFile, updateFileList } from '../../../store/reducers/fileReducer';
import { IFile, Id } from '../../../types/types';
import Loader from '../../ui/Loader/Loader';
import LoadError from '../../ui/Loader/LoadError';

interface AttachmentsProps extends ComponentProps<'div'> {
	taskId: Id
}

const Attachments = function({taskId, className = '', children, ...props}: AttachmentsProps) {

	const dispatch = useAppDispatch()

	let {isLoading, loadError, list} = useAppSelector(state => state.files)
	const files = [...list].reverse()

	useEffect(() => {
		dispatch(updateFileList(taskId))
	}, [taskId])


	let [inputValue, setInputValue] = useState('')
	let [description, setDescription] = useState('')

	const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
		setInputValue(e.currentTarget.value)
	}
	const handleDescriptionInputChange = (e: ChangeEvent<HTMLInputElement>) => {
		setDescription(e.currentTarget.value)
	}
	const uploadFile = () => {
		if (!inputValue) return;
		const newFile: IFile = {
			id: 0,
			taskId,
			date: Date.now(),
			path: inputValue,
			description
		}
		dispatch(createFile(newFile))
		clearInput()
	}
	const clearInput = () => {
		setInputValue('')
		setDescription('')
	}


	const openFile = () => {
		alert('Sorry, could not get file from server')
	}

	return (
		<div className={`${className} ${classes.wrapper}`} {...props}>
			{isLoading && <Loader className={classes.loader} />}
			{!!loadError && <LoadError className={classes.loadError} message={loadError} />}
			<div className={classes.inputFileWrapper}>
				<div className={classes.addFileButton}>
					<Icon name='icon-cross-bold' />
					<span>Attach file</span>
					<input
						className={classes.fileInput}
						type="file"
						value={inputValue}
						onChange={handleInputChange}
						title=''
					/>
				</div>
				{inputValue &&
					<>
						<p className={classes.inputFileName}>{getFileName(inputValue)}</p>
						<input
							className={classes.descriptionInput}
							type="text"
							value={description}
							onChange={handleDescriptionInputChange}
							placeholder='Add description'
						/>
						<div className={classes.inputButtons}>
							<button className={classes.confirmButton} onClick={uploadFile} title='upload file'>
								<Icon name='icon-ok' />
							</button>
							<button className={classes.cancelButton} onClick={clearInput} title='cancel'>
								<Icon name='icon-cross-bold' />
							</button>
						</div>
					</>
				}
			</div>

			<div className={classes.list}>
				{files.map((file, index) => {
					let fileName = getFileName(file.path)
					return (
						<button className={classes.file} onClick={openFile} key={index} title={file.description}>
							<Icon className={classes.fileIcon} name={getFileIconName(fileName)} />
							<p className={classes.fileName}>{fileName}</p>
						</button>
					)
				})}
			</div>

		</div>
	)
}
export default Attachments



function getFileName(path: string) {
	path = path.replace(/[\\/]$/, '')
	let split = path.split(/[\\/]/)
	return split[split.length - 1]
}
function getFileExt(fileName: string) {
	let split = fileName.split('.')
	return split[split.length - 1]
}
function getFileIconName(fileName: string) {
	const iconTypeExtensions = {
		file: ['doc','docx','txt','pdf'],
		image: ['jpg','jpeg','png','gif','webp'],
	}
	const ext = getFileExt(fileName)
	const prefix = 'icon-'
	let iconName = 'file' // default
	Object.entries(iconTypeExtensions).forEach(([key, value]) => {
		if (value.includes(ext)) iconName = key
	})
	return prefix + iconName
}
