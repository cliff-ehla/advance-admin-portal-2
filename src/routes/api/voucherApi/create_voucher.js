import {usermodel} from "$lib/usermodal";
import dayjs from "dayjs";

export const post = (req) => {
	const voucher_type = req.body.voucher_type
	const data = {
		voucher_type,
		phone: req.body.phone,
		lesson_fee: req.body.lesson_fee,
		app_fee: req.body.app_fee,
		voucher_date: dayjs().format('YYYY-MM-DD'),
		remark: req.body.remark
	}
	if (voucher_type === 'TICKET') {
		data.ticket_amt = req.body.ticket_amt
		data.ticket_expiry_date = dayjs().add(6, 'month').format('YYYY-MM-DD 00:00:00')
	} else if (voucher_type === 'COURSE' || voucher_type === 'TRIAL') {
		data.lesson_count = req.body.lesson_count
		data.lesson_duration = req.body.lesson_duration
		data.teacher_id = req.body.teacher_id
	}
	return usermodel(req, '/voucherApi/create_voucher', data)
}