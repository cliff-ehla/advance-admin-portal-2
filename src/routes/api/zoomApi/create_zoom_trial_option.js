import {usermodel} from "$lib/usermodal";

export const post = (req) => {
	return usermodel(req, '/zoomApi/create_zoom_trial_option', {
		remark: req.body.remark,
		phone: req.body.phone,
		is_trial: req.body.is_trial,
		zoom_reserved: req.body.zoom_reserved
	})
}