import {usermodel} from "$lib/usermodal";

export const post = (req) => {
	return usermodel(req, '/adminApi/create_parent_students', {
		students: req.body.students,
		parent_username: req.body.parent_username,
		parent_nickname: req.body.parent_nickname,
		parent_password: req.body.parent_password,
		parent_mobile: req.body.parent_mobile,
		reminder: req.body.reminder
	})
}