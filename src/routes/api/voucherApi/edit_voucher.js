import {usermodel} from "$lib/usermodal";

export const post = (req) => {
	return usermodel(req, '/voucherApi/edit_voucher', {
		id: req.body.id,
		is_invalid: req.body.is_invalid,
		lesson_fee: req.body.lesson_fee,
		app_fee: req.body.app_fee,
		remark: req.body.remark
	})
}