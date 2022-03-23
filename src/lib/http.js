import {sentry} from "$lib/sentry";
import {is_loading} from "$lib/store/is_loading";
import {notifications} from "$lib/store/notification";
import {browser} from "$app/env";

// handle 到 usermodel 500, 或者自己 500
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

			let status = res.status
			if (status >= 500) { // timeout
				let err_msg = status === 504 ? '504 timeout' : 'Internal server error'
				throw err_msg
			}
			const {success, data, metadata, debug} = await res.json()
			if (!success && debug && debug.err_code === 401 && browser && !['/login', '/logout'].includes(window.location.pathname)) {
				window.location.replace("/logout")
			}
			is_loading.set(false)
			return {success, data, metadata, debug, status}
		} catch (e) {
			notifications.alert(e)
			sentry.log(e)
			return {
				success: false,
				status: 500,
				debug: {
					debug_msg: `${resource}: <br> ${e}`
				}
			}
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
			const status = res.status
			if (status >= 500) { // timeout
				return {
					success: false,
					status
				}
			}
			const {success, data, metadata, debug} = await res.json()
			if (!success && debug && debug.err_code === 401 && browser && !['/login', '/logout'].includes(window.location.pathname)) {
				window.location.replace("/logout")
			}
			const actually_not_success = data ? data.status === 'failure' : false
			is_loading.set(false)
			if (!!notification) {
				if (!success || actually_not_success) {
					const message = actually_not_success ? data.debug_msg : debug.debug_msg
					notifications.alert('Oops.... ' + message)
				} else {
					notifications.success(notification)
				}
			}
			return {success, data, metadata, debug, status}
		} catch (e) {
			return {
				success: false,
				status: 500,
				debug: {
					debug_msg: `${resource}: <br> ${e}`
				}
			}
		}
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