import {usermodel} from "$lib/usermodal";

export const get = (req) => {
	return usermodel(req, '/syllabusApi/list_syllabus_category')
}