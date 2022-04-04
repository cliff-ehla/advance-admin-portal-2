import {usermodel} from "$lib/usermodal";

export const post = (req) => {
	return usermodel(req, '/courseApi/check_bought_status', {
		item_ids: req.body.item_ids,
		student_id: req.body.student_id
	})
}