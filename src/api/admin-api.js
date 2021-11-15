import {http} from "../helpers/http";

export async function fetchTutorSchedule ({start_time, end_time, teacher_ids}, _fetch) {
	try {
		const {data} = await http.post('zoomApi/list_teacher_available_time_in_calendar', {
			start_time, end_time, teacher_ids
		}, _fetch)
		return data
	} catch (e) {
		console.log(e)
	}
}

export async function createNewStudent (payload, _fetch) {
	try {
		const {data} = await http.post('adminApi/create_parent_student', {
			...payload
		}, _fetch)
		return data
	} catch (e) {}
}

export async function listAllHalfTutorGroup () {
	try {
		const {data} = await http.get('adminApi/list_all_half_tutor_group')
		return data
	} catch (e) {}
}

export async function listNearlyCompleteTutorGroup () {
	try {
		const {data} = await http.get('adminApi/list_all_nearly_completed_tutor_group')
		return data
	} catch (e) {}
}

