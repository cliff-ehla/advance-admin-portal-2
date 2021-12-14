import {usermodel} from "$lib/usermodal";
import dayjs from "dayjs";

export const post = (req) => {
	return usermodel(req, '/zoomApi/create_zoom_real_reserved', {
		related_trial_zoom_id: req.body.related_trial_zoom_id,
		title: req.body.title,
		student_id: req.body.student_id,
		zoom_reserved: req.body.zoom_reserved,
		syllabus: req.body.syllabus,
		syllabus_id: req.body.syllabus_id,
		app_fee: req.body.app_fee,
		lesson_fee: req.body.lesson_fee,
		is_renewal: req.body.is_renewal,
		voucher_date: dayjs().format('YYYY-MM-DD'),
		remark:  '',
		phone: ''
	})
}