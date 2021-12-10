import {usermodel} from "$lib/usermodal";

export const get = (req) => {
	return usermodel(req, `/userApi/user_info`)
}