import {usermodel} from "$lib/usermodal";

export const post = (req) => {
	return usermodel(req, '/zoomApi/lock_zoom_trial_option', {
		grouper_id: req.body.grouper_id,
		reserved_id: req.body.reserved_id
	})
}