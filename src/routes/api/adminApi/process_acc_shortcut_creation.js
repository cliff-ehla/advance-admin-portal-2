import {usermodel} from "$lib/usermodal";

export const post = (req) => {
	return usermodel(req, '/adminApi/process_acc_shortcut_creation', {
		parent_username: req.body.parent_username,
		parent_nickname: req.body.parent_nickname,
		parent_password: req.body.parent_password,
		parent_mobile: req.body.parent_mobile,
		is_trial_vip: req.body.is_trial_vip,
		lesson_fee: req.body.lesson_fee,
		app_fee: req.body.app_fee,
		voucher_date: req.body.voucher_date,
		payment_method: req.body.payment_method,
		ticket_amt: req.body.ticket_amt,
		ticket_expiry_date: req.body.ticket_expiry_date,
		remark: req.body.remark,
		students: req.body.students
	})
}