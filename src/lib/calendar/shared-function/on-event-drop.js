import {edit_lesson_tbc_to_date} from "../../../store/calendar-action-status-store";
import dayjs from "dayjs";

export const onEventDrop = ({e, onDrop}) => {
	if (e.event.extendedProps.type === 'edit_temp') {
		edit_lesson_tbc_to_date.update(v => {
			return {
				...v,
				...{
					to_start_date: dayjs(e.event.start).format('YYYY-MM-DD HH:mm:ss'),
					to_end_date: dayjs(e.event.end).format('YYYY-MM-DD HH:mm:ss')
				}
			}
		})
		onDrop(e.event.start)
	}
}