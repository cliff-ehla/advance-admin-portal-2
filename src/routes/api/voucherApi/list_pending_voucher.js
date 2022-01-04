import {usermodel} from "$lib/usermodal";

export const post = (req) => {
	return usermodel(req, '/voucherApi/list_pending_voucher', {
		start_date: req.body.start_date,
		end_date: req.body.end_date
	})
}