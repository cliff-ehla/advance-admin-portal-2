import {sentry} from "$lib/sentry";
import {is_loading} from "$lib/store/is_loading";
import {notifications} from "$lib/store/notification";

const http = (() => {
	async function get (fetch, resource, query) {
		if (query) {
			for (const property in query) {
				let char = resource.includes('?') ? '&' : '?'
				resource += `${char}${property}=${query[property]}`
			}
		}
		try {
			is_loading.set(true)
			const res = await fetch('/api' + resource)
			const {success, data, metadata, debug} = await res.json()
			is_loading.set(false)
			return {success, data, metadata, debug}
		} catch (e) {
			console.log(`fatal error: ${resource} this mostly happened when usermodel do not return a json body`, e)
		}

	}

	async function post (fetch, resource, body = {}, config = {}) {
		const {notification} = config
		// an empty object is necessary, otherwise result fatal error when not passing body params
		try {
			is_loading.set(true)
			const res = await fetch('/api' + resource, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: body && JSON.stringify(body)
			})
			const {success, data, metadata, debug} = await res.json()
			is_loading.set(false)
			if (!!notification) {
				if (success)
					notifications.success(notification)
				else
					notifications.alert('哎！錯誤發生了: ' + debug.debug_msg)
			}
			return {success, data, metadata, debug}
		} catch (e) {
			console.log(`fatal error: ${resource} this mostly happened when usermodel do not return a json body`, e)
			notifications.alert('哎！今次PK了，後台GG')
			return {
				success: false,
				data: false,
				status: 400,
				debug: 'Usermodel return fatal error'
			}
		}
	}

	return {
		get,
		post
	}
})()

const onFail = (debug) => {
	if (debug.err_code === 401) {
		return {
			status: 302,
			redirect: '/login'
		}
	}
	sentry.log(debug)
	return {
		error: new Error(debug.debug_msg),
		status: 400
	}
}

export {http, onFail}