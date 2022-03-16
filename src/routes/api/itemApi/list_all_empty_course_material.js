import {usermodel} from "$lib/usermodal";

export const get = (req) => {
	return usermodel(req, '/itemApi/list_all_empty_course_material')
}