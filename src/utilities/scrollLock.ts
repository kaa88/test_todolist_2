// import { scriptManager } from "./scriptManager"

/* 
	Module prevents window scrolling with menu, modals, etc. and
	prevents content jumps when scrollbar fades out.
*/
const lockedClassName = 'scroll-is-locked'
const cssVarName = '--scrollbar-width'
const calcDelay = 800
let timeoutID = null as null | ReturnType<typeof setTimeout>
let prevScrollbarWidth = null as null | number

export const scrollLock = {
	init() {
		this.calcScrollbarWidth()
		window.addEventListener('resize', this.calcScrollbarWidth.bind(this))
		// scriptManager.registerFunctions('scrollLock', {calcScrollbarWidth: this.calcScrollbarWidth})
	},
	calcScrollbarWidth() {
		if (timeoutID !== null) clearTimeout(timeoutID)
		timeoutID = setTimeout(function() {
			if (document.body.classList.contains(lockedClassName)) return;
			let scrollbarWidth = window.innerWidth - document.body.offsetWidth
			if (scrollbarWidth !== prevScrollbarWidth) {
				document.body.style.setProperty(cssVarName, scrollbarWidth + 'px')
				prevScrollbarWidth = scrollbarWidth
			}
		}, calcDelay)
	},
}
export function lockScroll() {
	document.body.classList.add(lockedClassName)
}
export function unlockScroll(timeout = 0) {
	setTimeout(() => {
		document.body.classList.remove(lockedClassName)
	}, timeout)
}
