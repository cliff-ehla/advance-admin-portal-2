import {usermodel} from "$lib/usermodal";

export const get = (req) => {
	return usermodel(req, '/adminApi/waiting_list')
}