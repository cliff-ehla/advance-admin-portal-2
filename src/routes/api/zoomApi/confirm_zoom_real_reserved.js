import {usermodel} from "$lib/usermodal";

export const post = (req) => {
	return usermodel(req, '/zoomApi/confirm_zoom_real_reserved', {
		grouper_id: req.body.grouper_id,
		is_renewal: req.body.is_renewal,
		confirm_summary: req.body.confirm_summary,
		voucher_id: req.body.voucher_id
	})
}