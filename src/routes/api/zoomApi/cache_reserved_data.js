import {usermodel} from "$lib/usermodal";

export const post = (req) => {
	return usermodel(req, '/zoomApi/cache_reserved_data', {
		grouper_id: req.body.grouper_id,
		s_nickname: req.body.s_nickname,
		gender: req.body.gender,
		course: req.body.course,
		material: req.body.material,
		age: req.body.age,
		lv: req.body.lv,
		general_message: req.body.general_message,
		is_confirmed: false
	})
}