import {http} from '../helpers/http'
import {deleteCookie, setCookie} from "../helpers/cookie";
import {user_store} from "../store/user-store";

export async function getUserInfo () {
	try {
		const {data} = await http.get('userApi/user_info')
		const _user = data && data[0]
		user_store.set(_user)
	} catch (e) {}
}

export async function login (body) {
	try {
		const {data} = await http.post('userApi/login', body)
		const _user = data && data[0]
		user_store.set(_user)
		const token = _user.user_session.access_token
		setCookie('token', token)
	} catch (e) {
		return Promise.reject(e)
	}
}

export async function logout () {
	try {
		http.post('userApi/logout')
		deleteCookie('token')
	} catch (e) {
		return Promise.reject(e)
	}
}

export async function checkUsername (username) {
	try {
		const {success} = await http.post('userApi/username_check', {
			username
		})
		return success
	} catch (e) {
		return false
	}
}