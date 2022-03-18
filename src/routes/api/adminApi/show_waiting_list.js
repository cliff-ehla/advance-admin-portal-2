import {usermodel} from "$lib/usermodal";

export const get = (req) => {
	return usermodel(req, `/adminApi/show_waiting_list`, {
		tutor_course_id: req.query.get('tutor_course_id')
	})
}