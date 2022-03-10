import {usermodel} from "$lib/usermodal";

export const post = (req) => {
	return usermodel(req, '/aiMembershipForceOpen/set_membership', {
		user_id: req.body.user_id,
		type: req.body.type,
		start_date: req.body.start_date,
		end_date: req.body.end_date
	})
}