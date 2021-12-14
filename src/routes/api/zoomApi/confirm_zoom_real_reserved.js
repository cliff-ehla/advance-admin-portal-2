import {usermodel} from "$lib/usermodal";
import dayjs from "dayjs";

export const post = (req) => {
	return usermodel(req, '/zoomApi/confirm_zoom_real_reserved', {
		grouper_id: req.body.grouper_id,
		app_fee: req.body.app_fee,
		lesson_fee: req.body.lesson_fee,
		is_renewal: req.body.is_renewal,
		confirm_summary: req.body.confirm_summary,
		voucher_date: dayjs().format('YYYY-MM-DD')
	})
}