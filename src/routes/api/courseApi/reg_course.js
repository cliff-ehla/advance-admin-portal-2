import {usermodel} from "$lib/usermodal";

export const post = (req) => {
	return usermodel(req, '/courseApi/reg_course', {
		item_id: req.body.item_id,
		teacher_id: req.body.teacher_id,
		start_date: req.body.start_date,
		duration: req.body.duration,
		student_size: req.body.student_size,
		ticket: req.body.ticket,
		classroom_id: req.body.classroom_id
	})
}