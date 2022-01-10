import {http} from "$lib/http";
import {user_info} from "$lib/store/user_info.js";
import {get} from "svelte/store";

const slack = (() => {
	const send = (msg) => {
		let _user_info = get(user_info)
		const nickname = _user_info ? (_user_info.nickname || _user_info.username ) : '未登入'
		return http.post(fetch,'/slack/post-message', {
			text: `${nickname}: ${msg}`
		})
	}
	return {
		send
	}
})()

export {slack}