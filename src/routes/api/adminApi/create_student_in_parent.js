import {usermodel} from "$lib/usermodal";

export const post = (req) => {
	return usermodel(req, '/adminApi/create_student_in_parent', {
		student_username: req.body.student_username,
		student_nickname: req.body.student_nickname,
		student_password: req.body.student_password,
		parent_id: req.body.parent_id,
		gender: req.body.gender,
		level: req.body.level,
		reminder: req.body.reminder
	})
}