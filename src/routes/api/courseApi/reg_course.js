import {usermodel} from "$lib/usermodal";

export const post = (req) => {
	return usermodel(req, '/courseApi/reg_course', {
		item_id: req.body.item_id,
		rc_level: req.body.rc_level,
		teacher_id: req.body.teacher_id,
		start_date: req.body.start_date,
		code_id: req.body.code_id,
		duration: req.body.duration,
		student_size: req.body.student_size
	})
}