import {usermodel} from "$lib/usermodal";

export const post = (req) => {
	return usermodel(req, '/tutorCourseApi/bind_tutor_course_with_zoom', {
		tutor_course_id: req.body.tutor_course_id,
		zoom_id: req.body.zoom_id
	})
}