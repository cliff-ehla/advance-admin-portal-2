import {usermodel} from "$lib/usermodal";

export const post = (req) => {
	console.log(req.body.start_date, req.body.end_date)
	return usermodel(req, '/courseApi/list_voucher', {
		start_date: req.body.start_date,
		end_date: req.body.end_date
	})
}