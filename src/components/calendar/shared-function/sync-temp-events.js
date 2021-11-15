import {genTempSelectEvent, genTempEditEvent} from "../phase-to-events";
import {course_lesson_tbc_selection} from "../../../store/calendar-action-status-store";

// type: trial_option_temp, edit_temp
export const syncTempEvents = (from_calendar, to_calendar, type = 'trial_option_temp') => {
	let day_calendar_events = from_calendar.getEvents().filter(e => e.extendedProps.type === type)
	to_calendar.getEvents().forEach(event => {
		if (event.extendedProps.type === type) {
			event.remove()
		}
	})
	let sync_events = day_calendar_events.map(e => {
		if (type === 'trial_option_temp') {
			return genTempSelectEvent(e)
		} else if (type === 'edit_temp') {
			return genTempEditEvent(e)
		}
	})
	let converted_events = sync_events.map(e => {
		return {
			start_date: e.start,
			end_date: e.end,
			teacher_id: ''
		}
	})
	course_lesson_tbc_selection.set(converted_events)
	to_calendar.addEventSource(sync_events)
}