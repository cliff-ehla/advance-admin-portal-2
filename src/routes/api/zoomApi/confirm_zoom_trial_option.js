import {usermodel} from "$lib/usermodal";

export const post = (req) => {
	return usermodel(req, '/zoomApi/confirm_zoom_trial_option', {
		reserved_id: req.body.reserved_id,
		item_id: req.body.item_id,
		title: req.body.title,
		lesson_fee: req.body.lesson_fee,
		app_fee: req.body.app_fee,
		voucher_date: req.body.voucher_date
	})
}