import {usermodel} from "$lib/usermodal";

export const post = (req) => {
	return usermodel(req, '/zoomApi/zoom_list_all', {
		start_date: req.body.start_time,
		end_date: req.body.end_time,
		teacher_ids: req.body.teacher_ids
	})
}