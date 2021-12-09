import {usermodel} from "$lib/usermodal";

export const post = (req) => {
	return usermodel(req, '/adminApi/create_parent_student', {
		student_username: req.body.student_username,
		student_nickname: req.body.student_nickname,
		student_password: req.body.student_password,
		parent_username: req.body.parent_username,
		parent_nickname: req.body.parent_nickname,
		parent_password: req.body.parent_password,
		gender: req.body.gender,
		level: req.body.level,
		parent_mobile: req.body.parent_mobile,
		reminder: ' '
	})
}