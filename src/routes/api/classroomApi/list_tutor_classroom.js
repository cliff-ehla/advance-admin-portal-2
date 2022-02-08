import {usermodel} from "$lib/usermodal";

export const post = (req) => {
	return usermodel(req, '/classroomApi/list_tutor_classroom', {
		teacher_id: req.body.teacher_id
	})
}