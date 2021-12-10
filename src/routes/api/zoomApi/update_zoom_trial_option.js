import {usermodel} from "$lib/usermodal";

export const post = (req) => {
	return usermodel(req, '/zoomApi/update_zoom_trial_option', {
		student_id: req.body.student_id,
		grouper_id: req.body.grouper_id,
		remark: req.body.remark
	})
}