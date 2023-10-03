
function PageTitle({value}: {value?: string}) {

	const siteName = 'TODOList'
	const divider = ' | '

	let title = siteName
	if (value) title = value + divider + title

	document.title = title

	return null
}

export default PageTitle