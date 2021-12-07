import {usermodel} from "$lib/usermodal";

export const get = (req) => {
	console.log('hi')
	return {
		status: 200,
		body: 'hi'
	}
	return usermodel(req, '/adminApi/list_students_with_ticket_info')
}