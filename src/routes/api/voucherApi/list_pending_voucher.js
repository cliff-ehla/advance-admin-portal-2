import {usermodel} from "$lib/usermodal";

export const post = (req) => {
	return usermodel(req, '/voucherApi/list_pending_voucher')
}