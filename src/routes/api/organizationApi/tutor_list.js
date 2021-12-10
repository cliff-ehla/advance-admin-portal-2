import {usermodel} from "$lib/usermodal";

export const get = (req) => {
	return usermodel(req, '/organizationApi/tutor_list?is_ehla=1')
}