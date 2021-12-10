import {usermodel} from "$lib/usermodal";

export const post = (req) => {
	console.log('req.body.reserved_grouper_id', 123)
	return usermodel(req, '/zoomApi/delete_zoom_reserved_grouper', {
		reserved_grouper_id: req.body.reserved_grouper_id
	})
}