import {sentry} from "$lib/sentry";

const http = (() => {
	async function get (fetch, resource, query) {
		if (query) {
			for (const property in query) {
				let char = resource.includes('?') ? '&' : '?'
				resource += `${char}${property}=${query[property]}`
			}
		}
		try {
			const res = await fetch('/api' + resource)
			const {success, data, metadata, debug} = await res.json()
			return {success, data, metadata, debug}
		} catch (e) {
			console.log(`fatal error: ${resource} this mostly happened when usermodel do not return a json body`, e)
		}

	}

	async function post (fetch, resource, body = {}) {
		// an empty object is necessary, otherwise result fatal error when not passing body params
		try {
			const res = await fetch('/api' + resource, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: body && JSON.stringify(body)
			})
			const {success, data, metadata, debug} = await res.json()
			return {success, data, metadata, debug}
		} catch (e) {
			console.log(`fatal error: ${resource} this mostly happened when usermodel do not return a json body`, e)
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