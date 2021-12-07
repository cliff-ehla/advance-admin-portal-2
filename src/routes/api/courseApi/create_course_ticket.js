import {usermodel} from "$lib/usermodal";
import dayjs from "dayjs";

export const post = (req) => {
	const voucher_date = dayjs().format('YYYY-MM-DD')
	const expiry_date = dayjs().add(6, 'month').format('YYYY-MM-DD HH:mm:ss')
	return usermodel(req, '/courseApi/create_course_ticket', {
		payer_id: req.body.payer_id,
		ticket_amt: req.body.ticket_amt,
		lesson_fee: req.body.lesson_fee,
		app_fee: req.body.app_fee,
		voucher_date,
		expiry_date
	})
}