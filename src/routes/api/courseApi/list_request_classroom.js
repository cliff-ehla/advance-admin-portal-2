import {usermodel} from "$lib/usermodal";

export const get = (req) => {
	return usermodel(req, '/courseApi/list_request_classroom')
}