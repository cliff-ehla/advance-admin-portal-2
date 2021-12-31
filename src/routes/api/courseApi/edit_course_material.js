import {usermodel} from "$lib/usermodal";

export const post = (req) => {
	return usermodel(req, '/courseApi/edit_course_material', {
		item_id: req.body.item_id,
		wrapper_id: req.body.wrapper_id,
		code_id: req.body.code_id,
		student_size: req.body.student_size,
		rc_level: req.body.rc_level,
		start_date: req.body.start_date,
		duration: req.body.duration
	})
}