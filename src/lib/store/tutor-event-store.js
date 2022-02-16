import {get, writable} from "svelte/store";
import {http} from "$lib/http.js";
import dayjs from "dayjs";
import {convertToEvents} from "$lib/calendar/phase-to-events.js";

const create_tutor_event_store = () => {
	const store = writable({})
	const cacheFirst = async (fetch, {tutor_id}) => {
		const cache = get(store)[tutor_id]
		if (cache) {
			fetchData(fetch, {tutor_id})
		} else {
			await fetchData(fetch, {tutor_id})
		}
	}
	const fetchData = async (fetch, {tutor_id}) => {
		let start_time = dayjs().subtract(3, 'month').format('YYYY-MM-DD HH:mm:ss')
		let end_time = dayjs().add(6, 'month').format('YYYY-MM-DD HH:mm:ss')
		let p1 = http.post(fetch,'/zoomApi/list_teacher_available_time_in_calendar', {
			start_time,
			end_time,
			teacher_ids: [tutor_id]
		})
		let p2 = http.post(fetch, '/zoomApi/zoom_list_all', {
			start_time,
			end_time,
			teacher_ids: [tutor_id]
		})
		let [data, data2] = await Promise.all([p1,p2])
		data.data[0].zoom_time.forEach(z => {
			data2.data.forEach(_z => {
				if (z.zoom_id == _z.wrapper_id) {
					z.days = _z.days
					z.big_classroom_type = _z.big_classroom_type
					z.tutor_course_id = _z.tutor_course_id
					z.ticket = _z.ticket
					z.teacher_id = _z.teacher_id
					z.student_size = _z.student_size
				}
			})
		})
		const events = convertToEvents(data.data[0])
		store.update(v => {
			return {
				...v,
				[tutor_id]: events
			}
		})
		return events
	}
	const getTutorEvents = (tutor_id, filters = {}) => {
		const {skip_available, is_grid_view} = filters
		let events = get(store)[tutor_id]
		if (!events) return []
		// events = events.filter(e => {
		// 	return true
		// 	const isSameMonth = dayjs(e.start).isSame(dayjs(`${YYYY_MM}-01`), 'month')
		// 	// const isType = e.extendedProps.type !== 'available'
		// 	return isSameMonth
		// })
		events = JSON.parse(JSON.stringify(events))
		if (is_grid_view) {
			events.forEach(e => {
				if (e.extendedProps.type === 'available') {
					let converted_start_date = dayjs(e.start).format('YYYY-MM-DD')
					e.start = converted_start_date
					e.end = null
				}
			})
		}
		return events
	}
	return {
		subscribe: store.subscribe,
		fetchData,
		cacheFirst,
		getTutorEvents
	}
}

export const tutor_event_store = create_tutor_event_store()