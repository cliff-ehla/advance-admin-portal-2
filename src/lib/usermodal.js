import {variables} from "$lib/env";
const base = variables.api_base + '/v1'

const usermodel = async (request, resource, data) => {
	if (request.method === 'POST' && data) {
		data = { params: data }
	}
	let query = {
		'encode': 1,
		'access-token': request.locals.access_token
	}
	if (request.method === 'GET' && data) {
		query = {...query, ...data}
		data = null
	}
	let url = `${base}${resource}`
	for (const property in query) {
		if (query[property]) {
			let char = url.includes('?') ? '&' : '?'
			url += `${char}${property}=${query[property]}`
		}
	}

	const res = await fetch(url, {
		method: request.method,
		headers: {
			'Authorization': 'Basic ZWhsX2FwaToyNzE1MDkwMA==',
			'Content-Type': 'application/json'
		},
		body: data && JSON.stringify(data)
	})

	return {
		status: res.status,
		body: await res.json()
	}
}

export {usermodel}