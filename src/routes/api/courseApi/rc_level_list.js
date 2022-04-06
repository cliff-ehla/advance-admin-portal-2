import {usermodel} from "$lib/usermodal";

export const get = (req) => {
	return usermodel(req, '/courseApi/rc_level_list')
}