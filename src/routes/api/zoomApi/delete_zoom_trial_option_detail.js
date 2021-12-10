import {usermodel} from "$lib/usermodal";

export const post = (req) => {
	return usermodel(req, '/zoomApi/delete_zoom_trial_option_detail', {
		grouper_id: req.body.grouper_id,
		reserved_id: req.body.reserved_id
	})
}