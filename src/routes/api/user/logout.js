import {usermodel} from "$lib/usermodal";
import cookie from "cookie";

export const post = async (req) => {
	await usermodel(req, '/userApi/logout')
	let _cookie = cookie.serialize('access_token', '', {
		path: '/',
		httpOnly: true,
		maxAge: 0
	});
	let user_info = cookie.serialize('user_info', '', {
		path: '/',
		httpOnly: true,
		maxAge: 0
	});
	return {
		status: 200,
		headers: {
			'set-cookie': [_cookie, user_info]
		}
	}
}