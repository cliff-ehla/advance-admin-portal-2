import {getCookie, deleteCookie} from "./cookie";

let http = (() => {
	const baseUrl = process.env.NODE_ENV === 'development' ? 'https://usermodel-dev.ehlacademy.org/v1' : 'https://usermodel.ehlacademy.org/v1'
	async function post (url, body) {
		const token = getCookie('token') || '2329896.fc9bd669af87a69df951e8cd88cfe0a4e517e4de' // TODO
		const full_url = `${baseUrl}/${url}?encode=1&access-token=${token}`
		const res = await fetch(full_url, {
			method: 'POST',
			headers: {
				'Authorization': 'Basic ZWhsX2FwaToyNzE1MDkwMA==',
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({
				params: body
			})
		})
		if (res.status === 401)
			on404()
		const result = await res.json()
		if (result.success)
			return Promise.resolve(result)
		else
			return Promise.reject(result)
	}

	async function get (url, query) {
		const token = getCookie('token')
		let full_url = `${baseUrl}/${url}?encode=1&access-token=${token}`
		if (query) {
			let query_string = ''
			for (let queryKey in query) {
				query_string += `&${queryKey}=${query[queryKey]}`
			}
			full_url += query_string
		}
		const res = await fetch(full_url, {
			method: 'GET',
			headers: {
				'Authorization': 'Basic ZWhsX2FwaToyNzE1MDkwMA==',
				'Content-Type': 'application/json'
			}
		})
		if (res.status === 401)
			on404()
		return await res.json()
	}

	const on404 = () => {
		deleteCookie('token')
		let is_login_page = location.href.includes('login')
		if (!is_login_page) location.href = '/'
	}

	return {
		post,
		get
	}
})()

// export default http
export {http}