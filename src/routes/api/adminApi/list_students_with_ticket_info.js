import {usermodel} from "$lib/usermodal";

export const get = (req) => {
	return usermodel(req, '/adminApi/list_students_with_ticket_info')
}