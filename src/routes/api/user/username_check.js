import {usermodel} from "$lib/usermodal";

export const post = (req) => {
	return usermodel(req, '/userApi/username_check', {
		username: req.body.username
	})
}