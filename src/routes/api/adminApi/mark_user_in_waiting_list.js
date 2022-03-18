import {usermodel} from "$lib/usermodal";

export const post = (req) => {
	return usermodel(req, '/adminApi/mark_user_in_waiting_list', {
		student_id: req.body.student_id,
		tutor_course_id: req.body.tutor_course_id,
		remark: req.body.remark
	})
}