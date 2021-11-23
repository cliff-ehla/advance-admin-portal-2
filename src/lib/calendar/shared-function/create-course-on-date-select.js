import {action_status, course_start_hh_mm, course_end_hh_mm, course_lesson_tbc_selection} from "../../../store/calendar-action-status-store";
import {get} from 'svelte/store'
import {getSelectedDateEvent} from "./get-today-event";
import {genTempSelectEvent} from "../phase-to-events";
import dayjs from "dayjs";

export const createCourseOnDateSelect = (e, month_calendar, day_calendar, tutor_id) => {
	let type = get(action_status)
	let arr = ['create_leave', 'create_course']
	if (arr.includes(type)) {
		let tbc_event = getSelectedDateEvent(month_calendar, e.start)
		if (!tbc_event) {
			const yyyy_mm_ss = dayjs(e.start).format('YYYY-MM-DD')
			let start, end
			if (type === 'create_course') {
				start = `${yyyy_mm_ss} ${get(course_start_hh_mm)}:00`
				end = `${yyyy_mm_ss} ${get(course_end_hh_mm)}:00`
			} else if (type === 'create_leave') {
				start = `${yyyy_mm_ss} 00:00:00`
				end = `${yyyy_mm_ss} 23:59:59`
			}
			let calendars = [month_calendar, day_calendar]
			let new_selected_event = genTempSelectEvent({start, end})
			calendars.forEach(c => {
				c.addEventSource([new_selected_event])
			})
			course_lesson_tbc_selection.add({
				start_date:start,
				end_date: end,
				teacher_id: tutor_id
			})
		}
	}
}