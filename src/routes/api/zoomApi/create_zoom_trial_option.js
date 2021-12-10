import {usermodel} from "$lib/usermodal";

export const post = (req) => {
	return usermodel(req, '/zoomApi/create_zoom_trial_option', {
		zoom_reserved: req.body.zoom_reserved,
		phone: req.body.phone || 'DUMMY',
		is_trial: true,
		remark: req.body.remark || ' '
	})
}