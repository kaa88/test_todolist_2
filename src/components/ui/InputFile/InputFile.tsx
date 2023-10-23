import { ChangeEvent, ComponentProps, useEffect, useRef } from 'react';
import classes from './InputFile.module.scss';

interface InputFileProps extends ComponentProps<'input'> {
	// changeCallback: ({file, blob}, errorMessage: string) => {}
	isTemporary: boolean
}

const InputFile = function({
	className = '',
	children,
	// onChange,
	isTemporary,
	...props
}: InputFileProps) {

	const inputRef = useRef<HTMLInputElement>(null)
	useEffect(() => {
		if (isTemporary && inputRef.current) inputRef.current.value = ''
	})

	// async function compressImage(image: any) {
	// 	const options = {
	// 		maxWidthOrHeight: 890, // 410x500 is max size in the template
	// 		initialQuality: 0.8, // 0 to 1
	// 	}
	// 	try {
	// 		let compressedImage = await imageCompression(image, options)
	// 		return new File([compressedImage], image.name, {type: image.type})
	// 	} catch (error) {
	// 		console.log(error)
	// 		return image
	// 	}
	// }

	async function uploadFile(e: ChangeEvent<HTMLInputElement>) {
		const FILE_TYPES = ['image/jpeg', 'image/png']
		const FILE_MAX_SIZE = 10

		let files = e.currentTarget.files
		let file = files ? files[0] : null
		if (!file) return;
		if (!FILE_TYPES.includes(file.type)) return; //onChange({}, 'Only images (jpeg, png) are allowed')
		if (file.size > FILE_MAX_SIZE * 1024 * 1024) return; //onChange({}, `File size must be less than ${FILE_MAX_SIZE} MB`)

		// file = await compressImage(file)

		// let reader = new FileReader()
		// reader.onload = function(e) {
		// 	onChange({file, blob: e.target.result})
		// }
		// reader.readAsDataURL(file)
	}

	return (
		<label className={`${className} ${classes.default}`}>
			<input
				type='file'
				accept='image/png, image/jpeg'
				onChange={uploadFile}
				title='?_Choose file'
				ref={inputRef}
				{...props}
			/>
			{children}
		</label>
	)
}

export default InputFile