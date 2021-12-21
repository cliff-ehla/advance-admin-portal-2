import {usermodel} from "$lib/usermodal";

export const post = (req) => {
	return usermodel(req, '/voucherApi/create_voucher', {
		voucher_type: req.body.voucher_type,
		user_id: req.body.user_id, // student_id or parent_id
	})
}