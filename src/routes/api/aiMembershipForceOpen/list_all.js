import {usermodel} from "$lib/usermodal";

export const get = (req) => {
	return usermodel(req, '/aiMembershipForceOpen/list_all')
}