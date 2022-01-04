import {usermodel} from "$lib/usermodal";

export const post = (req) => {
	return usermodel(req, '/courseApi/list_user_registrable_classroom_for_admin', {
		child_id: req.body.child_id
	})
}