import { ComponentProps } from 'react';
import classes from './Attachments.module.scss';
import InputFile from '../../ui/InputFile/InputFile';
import Icon from '../../ui/Icon/Icon';
import Button from '../../ui/Button/Button';

interface AttachmentsProps extends ComponentProps<'div'> {}

const Attachments = function({className = '', children, ...props}: AttachmentsProps) {

	const files = [
		{
			id: 1,
			name: 'title1.ljas2222idjf.png',
			info: 'descr1'
		},
		{
			id: 2,
			name: 'title2',
			info: 'descr2'
		},
		{
			id: 3,
			name: 'title3',
			info: 'descr3'
		},
		{
			id: 1,
			name: 'title1.ljas2222idjf.png',
			info: 'descr1'
		},
		{
			id: 2,
			name: 'title2',
			info: 'descr2'
		},
		{
			id: 3,
			name: 'title3',
			info: 'descr3'
		},
		{
			id: 1,
			name: 'title1.ljas2222idjf.png',
			info: 'descr1'
		},
		{
			id: 2,
			name: 'title2',
			info: 'descr2'
		},
		{
			id: 3,
			name: 'title3',
			info: 'descr3'
		},
	]

	const openFile = () => {
		alert('Sorry, file does not exist on server any more')
	}

	return (
		<div className={`${className} ${classes.wrapper}`} {...props}>
			<div className={classes.inputFile}>
				<div className={classes.addFileButton}>
					<Icon name='icon-cross-bold' />
					<span>Attach file</span>
					<input type="file" />
				</div>
				<p className={classes.inputFileName}>filename</p>
				<div className={classes.inputButtons}>
					<button className={classes.confirmButton} onClick={()=>{}} title='upload file'>
						<Icon name='icon-ok' />
					</button>
					<button className={classes.cancelButton} onClick={()=>{}} title='cancel'>
						<Icon name='icon-cross-bold' />
					</button>
				</div>
			</div>

			{/* <div className={classes.input}>
				<InputFile isTemporary={false} />
			</div> */}

			<div className={classes.list}>
				{files.map((file, index) =>
					<button className={classes.file} onClick={openFile} key={index} title={file.name}>
						<Icon className={classes.fileIcon} name='icon-file' />
						<p className={classes.fileName}>{file.name}</p>
					</button>
				)}
			</div>

		</div>
	)
}
export default Attachments