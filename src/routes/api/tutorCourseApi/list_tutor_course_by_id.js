import {usermodel} from "$lib/usermodal";

// call this when adding zoom lesson to a tutor's course,
// this will show available materials (that is not selected from the syllabus)
export const post = (req) => {
	return usermodel(req, '/tutorCourseApi/list_tutor_course_by_id', {
		tutor_course_id: req.body.tutor_course_id
	})
}