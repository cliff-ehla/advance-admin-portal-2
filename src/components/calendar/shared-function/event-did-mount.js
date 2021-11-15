import dayjs from "dayjs";
import tippy from "tippy.js";

export const eventDidMount = ({el, event}) => {
	let start = dayjs(event.start)
	let end = dayjs(event.end)
	let duration = end.diff(start,'minute')
	if (event.extendedProps.type !== 'available') {
		let students = event.extendedProps.students || []
		let student_names = students.map(s => s.nickname).join(',')
		tippy(el, {
			content: start.format('h:mm a') + ' - ' + end.format('h:mm a') + ` (${duration} min) ${student_names}`,
		})
	}
}