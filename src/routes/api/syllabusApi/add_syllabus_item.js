import {usermodel} from "$lib/usermodal";

export const post = (req) => {
	return usermodel(req, '/syllabusApi/add_syllabus_item', {
		syllabus_id: req.body.syllabus_id,
		item_id: req.body.item_id,
		s_ordering: 9999
	})
}