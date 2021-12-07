import {http} from '../helpers/http'
import {tutor_store} from "./tutor-store";
import {student_store} from "./student-store";

export async function fetchTeacherList () {
	let {data} = await http.get('organizationApi/tutor_list', {
		is_ehla: 1
	})
	data.sort((a,b) => {
		return a.nickname > b.nickname ? 1 : -1
	})
	tutor_store.set(data)
}

export async function fetchStudentList (opt) {
	const teacher_id = opt ? opt.teacher_id : null
	let {data} = await http.get('organizationApi/student_list', {
		teacher_id
	})
	student_store.set(data)
	return data
}

export async function getMaterialList (category) {
	try {
		const {data} = await http.post('organizationApi/get_tutor_group_item_list', {
			task_type: "reading-pdf",
			category_tag_type: category // TODO tutor group id
		})
		return data
	} catch (e) {
		console.log(e)
	}
}

export async function addMaterialToZoom ({item_id, tutor_group_id, wrapper_id, start_time}) {
	const {data} = await http.post('organizationApi/purchase_work_task', {
		item_ids: [item_id],
		tutor_group_id,
		wrapper_id,
		start_time,
		type_key: "reading-pdf"
	})
	return data
}