import {usermodel} from "$lib/usermodal";

export const post = (req) => {
	return usermodel(req, '/classroomApi/bind_tutor_classroom_with_zoom', {
		classroom_id: req.body.classroom_id,
		zoom_id: req.body.zoom_id
	})
}