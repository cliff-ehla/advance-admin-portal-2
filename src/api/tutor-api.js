import {http} from "../helpers/http";

export async function fetchTutorAvailableTimeSlot (tutor_id, _fetch) {
	try {
		const {data} = await http.post('tutorApi/list_available_timeslot', {
			teacher_id: tutor_id
		}, _fetch)
		return data
	} catch (e) {
		console.log(e)
	}
}

export async function setTutorAvailableTimeSlot ({start_time, end_time, timeslot, timeslot_id, teacher_id}, _fetch) {
	try {
		const {data} = await http.post('tutorApi/set_available_time', {
			start_time, end_time, timeslot, timeslot_id, teacher_id
		}, _fetch)
		return data
	} catch (e) {
		console.log(e)
	}
}

export async function deleteTutorAvailableTimeSlot ({timeslot_id, teacher_id}, _fetch) {
	try {
		const {data} = await http.post('tutorApi/delete_available_timeslot', {
			timeslot_id, teacher_id
		}, _fetch)
		return data
	} catch (e) {
		console.log(e)
	}
}

export async function createLeaveTime ({leave_times}, _fetch) {
	try {
		const {data} = await http.post('tutorApi/create_leave_times', {
			leave_times
		}, _fetch)
		return data
	} catch (e) {
		console.log(e)
	}
}

export async function deleteLeaveTime ({id}, _fetch) {
	try {
		const {data} = await http.post('tutorApi/delete_leave_time', {
			id
		}, _fetch)
		return data
	} catch (e) {
		console.log(e)
	}
}