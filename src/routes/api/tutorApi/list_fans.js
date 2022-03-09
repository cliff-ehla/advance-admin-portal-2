import {usermodel} from "$lib/usermodal";

export const post = (req) => {
	return usermodel(req, '/tutorApi/list_fans', {
		teacher_id: req.body.teacher_id
	})
}