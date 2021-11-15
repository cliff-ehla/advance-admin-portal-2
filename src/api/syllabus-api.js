import {http} from "../helpers/http";

export async function listSyllabus () {
	try {
		const {data} = await http.get('syllabusApi/list_syllabus')
		return data
	} catch (e) {
		console.log(e)
	}
}

export async function listAllSyllabusCategory () {
	try {
		const {data} = await http.get('syllabusApi/list_all_category')
		return data
	} catch (e) {
		console.log(e)
	}
}

export async function changeSyllabusCategory ({wrapper_id, category_type, category_level}) {
	try {
		const {data} = await http.post('syllabusApi/change_syllabus_category_type_in_tutor_group', {
			wrapper_id, category_type, category_level
		})
		return data
	} catch (e) {
		console.log(e)
	}
}
