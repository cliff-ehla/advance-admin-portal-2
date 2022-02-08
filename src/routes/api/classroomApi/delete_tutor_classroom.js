import {usermodel} from "$lib/usermodal";

export const post = (req) => {
	return usermodel(req, '/classroomApi/delete_tutor_classroom', {
		classroom_id: req.body.classroom_id
	})
}