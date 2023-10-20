import { ComponentProps } from 'react';
import classes from './TaskTime.module.scss';
import { DateService } from '../../../services/DateService';
import DatePicker, { registerLocale, setDefaultLocale } from 'react-datepicker';
import enGB from 'date-fns/locale/en-GB';
import "react-datepicker/dist/react-datepicker.css";

type Timestamp = number
export interface Dates {create: Timestamp, expire: Timestamp}
type DatesCallback = (dates: Dates) => void

interface TaskTimeProps extends ComponentProps<'div'> {
	dates: Dates
	callback: DatesCallback
}

const textDateFormat = 'DD.MM.YYYY'
const inputDateFormat = 'dd.MM.yyyy'
const textTimeFormat = 'HH:mm'
const inputTimeFormat = textTimeFormat
const textDateTimeFormat = `${textDateFormat} ${textTimeFormat}`
const inputDateTimeFormat = `${inputDateFormat} ${inputTimeFormat}`

const TaskTime = function({dates, callback, className = ''}: TaskTimeProps) {
	// react-datepicker localization
	registerLocale('en-GB', enGB)
	setDefaultLocale('en-GB')
	// /

	const createDate = DateService.getDate(dates.create, textDateTimeFormat)
	const remainingTime = DateService.getRemainingTime(Date.now(), dates.expire)
	const expiredClassName = dates.expire - Date.now() <= 0 ? classes.expired : ''

	const updateDate = (date: Date | null) => {
		if (callback && date) callback({
			create: dates.create, expire: date.getTime()
		})
	}

	return (
		<div className={`${className} ${classes.wrapper}`}>
			<div className={classes.blockTitle}>Created at:</div>
			<div className={classes.content}><span>{createDate}</span></div>
			<div className={classes.blockTitle}>Deadline:</div>
			<div className={classes.content}>
				<DatePicker
					className={classes.customInput}
					popperClassName={classes.popup}
					selected={new Date(dates.expire)}
					onChange={updateDate}
					dateFormat={inputDateTimeFormat}
					timeFormat={inputTimeFormat}
					showTimeSelect
				/>
			</div>
			<div className={classes.blockTitle}>Time remaining:</div>
			<div className={classes.content}><span className={expiredClassName}>{remainingTime}</span></div>
		</div>
	)
}
export default TaskTime