import {usermodel} from "$lib/usermodal";

export const post = (req) => {
	return usermodel(req, '/courseApi/purchase_course_ticket', {
		parent_id: req.body.parent_id,
		voucher_id: req.body.voucher_id,
	})
}