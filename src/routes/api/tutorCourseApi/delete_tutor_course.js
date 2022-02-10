import {usermodel} from "$lib/usermodal";

export const post = (req) => {
	return usermodel(req, '/tutorCourseApi/delete_tutor_course', {
		tutor_course_id: req.body.tutor_course_id
	})
}