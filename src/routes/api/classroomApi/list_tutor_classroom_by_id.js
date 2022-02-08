import {usermodel} from "$lib/usermodal";

// call this when adding zoom lesson to a tutor's course,
// this will show available materials (that is not selected from the syllabus)
export const post = (req) => {
	return usermodel(req, '/classroomApi/list_tutor_classroom_by_id', {
		classroom_id: req.body.classroom_id
	})
}