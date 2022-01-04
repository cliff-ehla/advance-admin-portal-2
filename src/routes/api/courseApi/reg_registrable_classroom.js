import {usermodel} from "$lib/usermodal";

export const post = (req) => {
	return usermodel(req, '/courseApi/reg_registrable_classroom', {
		tutor_group_id: req.body.tutor_group_id,
		child_id: req.body.child_id
	})
}