import {usermodel} from "$lib/usermodal";

export const post = (req) => {
	return usermodel(req, '/zoomApi/create_zoom_real_reserved', {
		related_trial_zoom_id: req.body.related_trial_zoom_id,
		title: req.body.title,
		student_id: req.body.student_id,
		zoom_reserved: req.body.zoom_reserved,
		syllabus: req.body.syllabus,
		syllabus_id: req.body.syllabus_id,
		remark:  '',
		phone: ''
	})
}