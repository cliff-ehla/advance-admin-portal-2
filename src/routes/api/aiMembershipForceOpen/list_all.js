import {usermodel} from "$lib/usermodal";

export const get = (req) => {
	return usermodel(req, `/aiMembershipForceOpen/list_all`, {
		is_member: req.query.get('is_member'),
		search: req.query.get('search')
	})
}