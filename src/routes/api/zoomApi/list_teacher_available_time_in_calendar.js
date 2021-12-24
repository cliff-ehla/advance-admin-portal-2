import {usermodel} from "$lib/usermodal";

export const post = (req) => {
	return usermodel(req, '/zoomApi/list_teacher_available_time_in_calendar', {
		start_time: req.body.start_time,
		end_time: req.body.end_time,
		teacher_ids: req.body.teacher_ids
	})
}