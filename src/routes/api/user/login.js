import {usermodel} from "$lib/usermodal";
import cookie from "cookie";

export const post = async (req) => {
	const res = await usermodel(req, '/userApi/login', {
		username: req.body.username,
		password: req.body.password
	})

	if (res.body.success) {
		let user = res.body.data[0]
		let _cookie = cookie.serialize('access_token', user.user_session.access_token, {
			path: '/',
			httpOnly: false // TODO: the old http client is using browser cookie
		});
		let user_info = {
			nickname: user.nickname,
			username: user.username,
			profile_pic: user.avatar.filepath,
		}
		let user_info_cookie = cookie.serialize('user_info', JSON.stringify(user_info), {
			path: '/',
			httpOnly: false // TODO: the old http client is using browser cookie
		})

		return {
			status: res.status,
			headers: {
				'set-cookie': [_cookie, user_info_cookie]
			},
			body: {
				...res.body,
				...{data: user}
			}
		}
	}

	return res
}