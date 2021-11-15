import {http} from "../helpers/http";

export async function listStudentNote ({student_id, teacher_id}) {
	const {data} = await http.post('studentNoteApi/list_student_note', {
		student_id, teacher_id
	})
	return data
}

export async function createStudentNote ({student_id, teacher_id, note}) {
	const {data} = await http.post('studentNoteApi/set_student_note', {
		student_id,
		teacher_id,
		note
	})
	return data
}

export async function updateStudentNote ({note_id, student_id, teacher_id, note}) {
	const {data} = await http.post('studentNoteApi/update_student_note', {
		note_id,
		student_id,
		teacher_id,
		note
	})
	return data
}

export async function deleteStudentNote ({note_id}) {
	const {data} = await http.post('studentNoteApi/delete_student_note', {
		note_id
	})
	return data
}

