import dayjs from "dayjs";

export function getSelectedDateEvent (calendar, selected_date, type = 'trial_option_temp') {
	let tbc_event = calendar.getEvents().filter(evt => {
		let is_tbc = evt.extendedProps.type === type
		let is_this_day = dayjs(evt.start).isSame(selected_date, 'day')
		return is_this_day && is_tbc
	})
	return tbc_event && tbc_event[0]
}