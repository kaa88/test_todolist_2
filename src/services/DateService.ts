import dayjs from 'dayjs';

const defaultTimeFormat = 'DD.MM.YYYY HH:mm'

export const DateService = {
	getDate(timestamp: number, format?: string) {
		return dayjs(timestamp).format(format || defaultTimeFormat)
	},
	getRemainingTime(start: number, end: number) {
		const startDate = dayjs(start)
		let endDate = dayjs(end)
		const dayDiff = endDate.diff(startDate, 'day')
		endDate = dayjs(endDate.subtract(dayDiff, 'day'))
		const hourDiff = endDate.diff(startDate, 'hour')
		endDate = dayjs(endDate.subtract(hourDiff, 'hour'))
		const minDiff = endDate.diff(startDate, 'minute')
		return `${dayDiff}d ${hourDiff}h ${minDiff}m`
	}
}