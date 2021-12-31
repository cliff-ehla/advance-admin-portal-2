import {usermodel} from "$lib/usermodal";

export const post = (req) => {
	return usermodel(req, '/organizationApi/purchase_work_task', {
		item_ids: req.body.item_ids,
		tutor_group_id: req.body.tutor_group_id,
		wrapper_id: req.body.wrapper_id,
		start_time: req.body.start_time,
		type_key: "reading-pdf"
	})
}