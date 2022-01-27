import {usermodel} from "$lib/usermodal";

export const post = (req) => {
	if (!req.body.teacher_id) {
		return {
			status: 200,
			body: {
				success: false,
				debug: {
					debug_msg: 'Teacher id is missing'
				}
			}
		}
	}
	return usermodel(req, '/zoomApi/edit_zoom', {
		wrapper_id: req.body.wrapper_id,
		tutor_group_id: req.body.tutor_group_id,
		duration: req.body.duration,
		teacher_id: req.body.teacher_id,
		title: req.body.title,
		start_date: req.body.start_date,
		end_date: req.body.end_date,
		reminder_date: req.body.start_date,
		f_repeat_zoom_link: true,
	})
}