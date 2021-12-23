import {usermodel} from "$lib/usermodal";

export const post = (req) => {
	return usermodel(req, '/voucherApi/edit_voucher', {
		id: req.body.id,
		is_invalid: req.body.is_invalid
	})
}