import {usermodel} from "$lib/usermodal";

export const post = (req) => {
	return usermodel(req, '/adminApi/list_paid_user_level_distribution', {
		start_date: req.body.start_date,
		end_date: req.body.end_date
	})
}