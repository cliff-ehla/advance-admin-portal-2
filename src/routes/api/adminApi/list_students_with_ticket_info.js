import {usermodel} from "$lib/usermodal";

export const get = (req) => {
	// console.log('h i', usermodel)

	return usermodel(req, '/adminApi/list_students_with_ticket_info')
}