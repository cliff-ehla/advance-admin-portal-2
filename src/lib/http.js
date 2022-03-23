import {sentry} from "$lib/sentry";
import {is_loading} from "$lib/store/is_loading";
import {notifications} from "$lib/store/notification";
import {browser} from "$app/env";

const onRes = async (res, notification) => {
	try {
		let status = res.status
		if (status >= 500)
			throw status === 504 ? '504 timeout' : 'Internal server error'
		const {success, data, metadata, debug} = await res.json()
		if (!success && debug && debug.err_code === 401 && browser && !['/login', '/logout'].includes(window.location.pathname)) {
			window.location.replace("/logout")
		}
		const actually_not_success = data ? data.status === 'failure' : false
		is_loading.set(false)
		if (!!notification) {
			if (!success || actually_not_success) {
				const message = actually_not_success ? data.debug_msg : debug.debug_msg
				notifications.alert('Oops...' + message)
			} else {
				notifications.success(notification)
			}
		}
		return {success, data, metadata, debug, status}
	} catch (e) {
		const debug_msg = `${res.url} ${e}`
		notifications.alert(debug_msg)
		sentry.log(e)
		return {
			success: false,
			status: 500,
			debug: {
				debug_msg
			}
		}
	}
}

// handle 到 usermodel 500, 或者自己 500
const http = (() => {
	async function get (fetch, resource, query, config = {}) {
		const {notification} = config
		if (query) {
			for (const property in query) {
				let char = resource.includes('?') ? '&' : '?'
				resource += `${char}${property}=${query[property]}`
			}
		}
		is_loading.set(true)
		const res = await fetch('/api' + resource)
		return onRes(res, notification)
	}

	// an empty object is necessary, otherwise result fatal error when not passing body params
	async function post (fetch, resource, body = {}, config = {}) {
		const {notification} = config
		is_loading.set(true)
		const res = await fetch('/api' + resource, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: body && JSON.stringify(body)
		})
		return onRes(res, notification)
	}

	return {
		get,
		post
	}
})()

const onFail = (debug, status) => {
	if ((debug.err_code) === 401) {
		return {
			status: 302,
			redirect: '/logout'
		}
	}
	return {
		error: debug && debug.debug_msg,
		status
	}
}

export {http, onFail}