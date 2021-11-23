import dayjs from "dayjs";
import utc from "dayjs/plugin/utc.js"
dayjs.extend(utc)

export const genBookedEventFromZoom = (zoom) => {
	return {
		start: dayjs.utc(zoom.start_time).toDate(),
		end: dayjs.utc(zoom.end_time).toDate(),
		display: 'block',
		backgroundColor: zoom.big_classroom_type === 'SMALL' ? '#C342B7'
				: zoom.big_classroom_type === 'BIG' ? '#9519C0'
				: zoom.is_trial ? '#3E963D' : '#3357A7',
		editable: false,
		extendedProps: {...zoom, ...{type: 'book'}}
	}
}

const genAvailableEvent = (e) => {
	return {
		start: dayjs.utc(e.start_time).toDate(),
		end: dayjs.utc(e.end_time).toDate(),
		display: 'inverse-background',
		backgroundColor: 'gray',
		groupId: 'availableSlot',
		editable: false,
		extendedProps: {
			type: 'available'
		}
	}
}

export const genTrialOptionEventFromZoom = (zoom, locked) => {
	return {
		start: dayjs.utc(zoom.start_time).toDate(),
		end: dayjs.utc(zoom.end_time).toDate(),
		display: 'block',
		backgroundColor: locked ? 'red': '#B5B5B5',
		editable: false,
		extendedProps: {...zoom, ...{type: 'trial_option'}}
	}
}

export const genReservedEventFromZoom = (zoom) => {
	return {
		start: dayjs.utc(zoom.start_time).toDate(),
		end: dayjs.utc(zoom.end_time).toDate(),
		display: 'block',
		backgroundColor: '#D6C884',
		editable: false,
		extendedProps: {...zoom, ...{type: 'reserved'}}
	}
}

export const genFfReservedEventFromZoom = (zoom) => {
	return {
		start: dayjs.utc(zoom.start_time).toDate(),
		end: dayjs.utc(zoom.end_time).toDate(),
		display: 'block',
		backgroundColor: zoom.students.length ? '#b1e4b0' : '#B5B5B5',
		editable: false,
		extendedProps: {...zoom, ...{type: 'ff_reserved'}}
	}
}

export const genTempSelectEvent = ({start, end}) => {
	return {
		title: 'Z', // for ordering
		start: start,
		end: end,
		editable: true,
		backgroundColor: 'orange',
		display: 'block',
		extendedProps: {type: 'trial_option_temp'}
	}
}

export const genTempEditEvent = ({start, end, title}) => {
	return {
		title: title,
		start: start,
		end: end,
		editable: true,
		backgroundColor: 'orange',
		display: 'block',
		extendedProps: {type: 'edit_temp'}
	}
}

export const genLeaveEvent = ({start_time, end_time, id}) => {
	return {
		title: 'AL',
		start: dayjs.utc(start_time).toDate(),
		end: dayjs.utc(end_time).toDate(),
		backgroundColor: 'black',
		display: 'block',
		extendedProps: {type: 'leave', id}
	}
}

export const convertToEvents = (data) => {
	let available = data.available_time
	let booked_lessons = data.zoom_time
	let trial_option = data.trial_option_time
	let locked_trial_option = data.locked_trial_option_time
	let reserved = data.real_reserved_time
	let ff_reserved = data.ff_reserved_time
	let leave_time = data.leave_time
	trial_option = trial_option.map(e => genTrialOptionEventFromZoom(e))
	locked_trial_option = locked_trial_option.map(e => genTrialOptionEventFromZoom(e, true))
	leave_time = leave_time.map(e => genLeaveEvent(e))
	available = available.map(e => genAvailableEvent(e))
	booked_lessons = booked_lessons.map(zoom => genBookedEventFromZoom(zoom))
	reserved = reserved.map(zoom => genReservedEventFromZoom(zoom))
	ff_reserved = ff_reserved.map(zoom => genFfReservedEventFromZoom(zoom))
	let dummy_available = genAvailableEvent({
		start_time: '1970-01-01:12:00:00',
		end_time: '1970-01-01:12:00:00',
	})
	return [...available, ...booked_lessons, ...trial_option, ...locked_trial_option, ...leave_time, dummy_available, ...reserved, ...ff_reserved]
}
