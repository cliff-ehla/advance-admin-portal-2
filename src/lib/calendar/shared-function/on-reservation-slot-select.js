import FineTunePopup from "../../calendar/time-fine-tune-popup.svelte";
import {action_status, calendar_store, course_lesson_tbc_selection} from "../../../store/calendar-action-status-store";
import dayjs from "dayjs";
import {get} from "svelte/store";
import {genTempSelectEvent} from "../phase-to-events";

export const onReservationSlotSelect = ({jsEvent, start, end}, openPopper, calendar, user_id, month_calendar) => {
	let _action_status = get(calendar_store).status || get(action_status)
	console.log('_action_status', _action_status)

	if (_action_status === 'create_option' || _action_status === 'create_trial' || _action_status === 'create_big_class') {
		let _start_time = dayjs(start).format('HH:mm')
		let _end_time = dayjs(end).format('HH:mm')
		openPopper(jsEvent.target, FineTunePopup, {
			start_time: _start_time,
			end_time: _end_time,
			onConfirm: ({start_hh_mm, end_hh_mm}) => {
				const yyyy_mm_ss = dayjs(start).format('YYYY-MM-DD')
				const start_date = `${yyyy_mm_ss} ${start_hh_mm}`
				const end_date = `${yyyy_mm_ss} ${end_hh_mm}`
				let calendars = [calendar, month_calendar]
				let new_selected_events = genTempSelectEvent({
					start: start_date,
					end: end_date
				})
				calendars.forEach(c => {
					c.addEventSource([new_selected_events])
				})
				course_lesson_tbc_selection.add({
					teacher_id: user_id,
					start_date: start_date,
					end_date: end_date,
				})
			}
		}, {
			placement: 'right',
			persistent_content: true
		})
	}
}