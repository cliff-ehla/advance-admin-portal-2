import {usermodel} from "$lib/usermodal";

export const post = (req) => {
	return usermodel(req, '/syllabusApi/list_syllabus_category_detail', {
		syllabus_id: req.body.syllabus_id
	})
}