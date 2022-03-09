import {usermodel} from "$lib/usermodal";

export const post = (req) => {
	return usermodel(req, '/syllabusApi/delete_syllabus_item', {
		syllabus_id: req.body.syllabus_id
	})
}