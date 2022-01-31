import {usermodel} from "$lib/usermodal";

export const get = (req) => {
	return usermodel(req, '/courseApi/list_all_course_description_code')
}