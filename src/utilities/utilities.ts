export function _waitServerResponse(seconds = 1) { // 1
	return new Promise((resolve) => {
		setTimeout(() => resolve(true), seconds * 1000)
	})
}

export function getCssVariable(name: string) {
	const errorMessage = `Could not find CSS variable "${name}"`
	let value = null
	if (name) {
		const varPrefix = '--'
		if (!name.match(new RegExp('^' + varPrefix))) name = varPrefix + name
		let variable = parseFloat(getComputedStyle(document.body).getPropertyValue(name))
		if (!isNaN(variable)) value = variable
	}
	if (value === null) {
		console.error(errorMessage)
		return 0
	}
	return value
}
