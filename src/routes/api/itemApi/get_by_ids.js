import {usermodel} from "$lib/usermodal";

export const post = (req) => {
	return usermodel(req, '/itemApi/get_by_ids', {
		ids: req.body.ids
	})
}