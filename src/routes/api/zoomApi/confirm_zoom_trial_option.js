import {usermodel} from "$lib/usermodal";

export const post = (req) => {
	return usermodel(req, '/zoomApi/confirm_zoom_trial_option', {
		reserved_id: req.body.reserved_id,
		item_id: req.body.item_id,
		title: req.body.title,
		voucher_id: req.body.voucher_id,
		confirm_summary: req.body.confirm_summary
	})
}