import {usermodel} from "$lib/usermodal";

export const post = (req) => {
	return usermodel(req, '/tutorCourseApi/list_tutor_course', {
		teacher_id: req.body.teacher_id
	})
}