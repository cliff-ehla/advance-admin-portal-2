import {usermodel} from "$lib/usermodal";

export const post = (req) => {
	return usermodel(req, '/adminApi/remove_user_from_waiting_list', {
		student_id: req.body.student_id,
		tutor_course_id: req.body.tutor_course_id
	})
}