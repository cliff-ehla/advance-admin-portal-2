import {usermodel} from "$lib/usermodal";

export const post = (req) => {
	return usermodel(req, '/voucherApi/set_voucher_status', {
		id: req.body.id,
		check_status: req.body.check_status
	})
}