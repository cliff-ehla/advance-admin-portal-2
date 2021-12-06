import {http} from "../helpers/http";
import {reservation_store} from "../store/reservation-store";

export async function fetchZoomDetails (wrapper_id, _fetch) {
	try {
		const {data} = await http.post('zoomApi/zoom_detail', {
			wrapper_id
		}, _fetch)
		return data
	} catch (e) {
		console.log(e)
	}
}

export async function fetchTutorSalary (teacher_id, _fetch) {
	try {
		const {data} = await http.post('zoomApi/list_tutor_salary', {
			teacher_id
		}, _fetch)
		return data
	} catch (e) {
		console.log(e)
	}
}

export async function setZoomActualDuration ({wrapper_id, actual_duration}, _fetch) {
	try {
		const {data} = await http.post('zoomApi/set_actual_duration', {
			wrapper_id, actual_duration
		}, _fetch)
		return data
	} catch (e) {
		console.log(e)
	}
}

export async function setZoomStudentNoShow ({wrapper_id, s_no_show}, _fetch) {
	try {
		const {data} = await http.post('zoomApi/set_student_no_show', {
			wrapper_id, s_no_show
		}, _fetch)
		return data
	} catch (e) {
		console.log(e)
	}
}

export async function setZoomTutorNoShow ({wrapper_id, t_no_show}, _fetch) {
	try {
		const {data} = await http.post('zoomApi/set_teacher_no_show', {
			wrapper_id, t_no_show
		}, _fetch)
		return data
	} catch (e) {
		console.log(e)
	}
}

export async function setZoomTrailSuccessBuyTime ({wrapper_id, trial_success_buy_time}, _fetch) {
	try {
		const {data} = await http.post('zoomApi/trial_success_buy_time', {
			wrapper_id, trial_success_buy_time
		}, _fetch)
		return data
	} catch (e) {
		console.log(e)
	}
}

export async function setZoomCancel ({wrapper_id, is_cancel}, _fetch) {
	try {
		const {data} = await http.post('zoomApi/set_is_cancel', {
			wrapper_id, is_cancel
		}, _fetch)
		return data
	} catch (e) {
		console.log(e)
	}
}

export async function setZoomIsTrail ({wrapper_id, is_trial}, _fetch) {
	try {
		const {data} = await http.post('zoomApi/set_is_trial', {
			wrapper_id, is_trial
		}, _fetch)
		return data
	} catch (e) {
		console.log(e)
	}
}

export async function setZoomSalary ({wrapper_id, override_salary}, _fetch) {
	try {
		const {data} = await http.post('zoomApi/set_override_salary', {
			wrapper_id, override_salary
		}, _fetch)
		return data
	} catch (e) {
		console.log(e)
	}
}

export async function setZoomRemark ({wrapper_id, admin_remark}, _fetch) {
	try {
		const {data} = await http.post('adminApi/set_admin_remark', {
			wrapper_id, admin_remark
		}, _fetch)
		return data
	} catch (e) {
		console.log(e)
	}
}

export async function createZoomOption (payload, _fetch) {
	try {
		const {data} = await http.post('zoomApi/create_zoom_trial_option', payload, _fetch)
		return data
	} catch (e) {
		console.log(e)
	}
}

export async function deleteZoomOption ({grouper_id, reserved_id}, _fetch) {
	try {
		const {data} = await http.post('zoomApi/delete_zoom_trial_option_detail', {
			grouper_id, reserved_id
		}, _fetch)
		return data
	} catch (e) {
		console.log(e)
	}
}

export async function addZoomOption ({grouper_id, zoom_reserved}, _fetch) {
	try {
		const {data} = await http.post('zoomApi/add_zoom_trial_option_detail', {
			grouper_id, zoom_reserved
		}, _fetch)
		return data
	} catch (e) {
		console.log(e)
	}
}

export async function lockZoomOption ({grouper_id, reserved_id}, _fetch) {
	try {
		const {data} = await http.post('zoomApi/lock_zoom_trial_option', {
			grouper_id, reserved_id
		}, _fetch)
		return data
	} catch (e) {
		console.log(e)
	}
}

export async function createZoomReserve (payload, _fetch) {
	try {
		const {data} = await http.post('zoomApi/create_zoom_real_reserved', payload, _fetch)
		return data
	} catch (e) {
		console.log(e)
	}
}

export async function deleteZoomReserve ({reserved_grouper_id}, _fetch) {
	try {
		const {data} = await http.post('zoomApi/delete_zoom_reserved_grouper', {reserved_grouper_id}, _fetch)
		return data
	} catch (e) {
		console.log(e)
	}
}

export async function listZoomReserve (_fetch) {
	try {
		const {data} = await http.post('zoomApi/list_zoom_trial_option', {}, _fetch)
		reservation_store.set(data)
		return data
	} catch (e) {
		console.log(e)
	}
}

export async function listZoomTrial (_fetch) {
	try {
		const {data} = await http.post('zoomApi/list_zoom_trial', {}, _fetch)
		return data
	} catch (e) {
		console.log(e)
	}
}

export async function listZoomReserved (_fetch) {
	try {
		const {data} = await http.post('zoomApi/list_zoom_real_reserved', {}, _fetch)
		return data
	} catch (e) {
		console.log(e)
	}
}

export async function setZoomTrialStatus ({wrapper_id, is_trial_success}, _fetch) {
	try {
		const {data} = await http.post('zoomApi/set_is_trial_success', {
			wrapper_id,
			is_trial_success
		}, _fetch)
		return data
	} catch (e) {
		console.log(e)
	}
}

export async function createZoom ({tutor_group_id, teacher_id, start_date, title, duration}) {
	try {
		const {data} = await http.post('zoomApi/create_zoom', {
			tutor_group_id,
			teacher_id,
			start_date,
			title,
			reminder_date: start_date,
			duration,
			f_repeat_zoom_link: true,
			reminder_value: 30,
			repeated_cnt: 1,
			zoom_link: ""
		})
		return data
	} catch (e) {}
}

export async function editZoom ({wrapper_id, teacher_id, teacher_nickname, start_date, reminder_value, duration, title}, _fetch) {
	try {
		const {data} = await http.post('zoomApi/edit_zoom', {
			wrapper_id,
			duration,
			f_repeat_zoom_link: true,
			reminder_date: start_date,
			reminder_value,
			start_date,
			teacher_id,
			teacher_nickname,
			title,
			zoom_link: ""
		}, _fetch)
		return data
	} catch (e) {}
}

export async function deleteZoom ({wrapper_id}, _fetch) {
	try {
		const {data} = await http.post('zoomApi/delete_zoom', {
			wrapper_id
		}, _fetch)
		return data
	} catch (e) {}
}

export async function editOption ({grouper_id, remark, phone}, _fetch) {
	try {
		const {data} = await http.post('zoomApi/update_zoom_trial_option', {
			grouper_id, remark, phone
		}, _fetch)
		return data
	} catch (e) {}
}

export async function confirmZoomTrial ({reserved_id, student_id, grouper_id, item_id, tutor_group_title, lesson_fee, app_fee, voucher_date}, _fetch) {
	try {
		await http.post('zoomApi/update_zoom_trial_option', {
			student_id, grouper_id
		}, _fetch)
		const {data} = await http.post('zoomApi/confirm_zoom_trial_option', {
			reserved_id,
			item_id,
			title: tutor_group_title,
			lesson_fee,
			app_fee,
			voucher_date
		}, _fetch)
		return data
	} catch (e) {}
}

export async function confirmZoomReserved ({grouper_id}, _fetch) {
	try {
		const {data} = await http.post('zoomApi/confirm_zoom_real_reserved', {
			grouper_id
		}, _fetch)
		return data
	} catch (e) {}
}

export async function fetchZoomMaterial ({start_date, end_date, teacher_ids}) {
	try {
		const {data} = await http.post('zoomApi/zoom_list_all', {
			start_date, end_date, teacher_ids
		})
		return data
	} catch (e) {}
}

export async function removeMaterialFromZoom ({wrapper_id, day_ids}, _fetch) {
	await http.post('zoomApi/update_zoom_day_task', {
		wrapper_id,
		day_ids
	}, _fetch)
}

export async function listZoom ({tutor_group_id}, _fetch) {
	const {data} = await http.post('zoomApi/zoom_list', {
		tutor_group_id
	}, _fetch)
	return data
}

export async function setMessageIsSent ({wrapper_id, is_msg_sent}, _fetch) {
	const {data} = await http.post('zoomApi/set_is_msg_sent', {
		wrapper_id, is_msg_sent
	}, _fetch)
	return data
}

export async function getTutorGroupByChildId ({child_id}, _fetch) {
	const {data} = await http.post('zoomApi/admin_get_zoom_list_all_by_child_id', {
		child_id
	}, _fetch)
	return data
}

export async function draftZoomOption ({grouper_id, s_nickname, course, gender, material, age, lv, general_message, is_confirmed}, _fetch) {
	const {data} = await http.post('zoomApi/cache_reserved_data', {
		grouper_id,
		s_nickname,
		course,
		material,
		age,
		gender,
		lv,
		general_message,
		is_confirmed
	}, _fetch)
	return data
}