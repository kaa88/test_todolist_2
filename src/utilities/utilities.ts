export function _wait(seconds = 1) {
	return new Promise((resolve) => {
		setTimeout(() => resolve(true), seconds * 1000)
	})
}
