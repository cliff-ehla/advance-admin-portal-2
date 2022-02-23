import {usermodel} from "$lib/usermodal";

export const post = (req) => {
	return usermodel(req, '/courseApi/list_registrable_classroom_for_admin', {
		start_date: req.body.start_date,
		end_date: req.body.end_date
	})
}