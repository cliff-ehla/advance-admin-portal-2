import {writable, get, derived} from "svelte/store";
import {big_class_mapper} from "$lib/store/big-class-mapper.js";
import {http} from "$lib/http.js";
import {notifications} from "$lib/store/notification.js";

const student_store = (() => {
	const store = writable([])

	const fetchData = async (fetch) => {
		const {data, success, debug} = await http.get(fetch, '/adminApi/list_students_with_ticket_info')
		if (success) {
			store.set(data)
			return data
		} else {
			notifications.alert(debug.debug_msg)
		}
	}

	const getStudent = (id) => {
		return get(store).find(t => t.student_id == id)
	}

	const getStudentName = (id) => {
		let t = getStudent(id)
		return t && t.student_nickname
	}

	const getGender = (id) => {
		let t = getStudent(id)
		return t && t.gender
	}

	const getStudentAvatar = (id) => {
		let t = getStudent(id)
		let gender = t && t.gender
		return `/student-${gender}-icon.png`
	}

	const getStudentLevel = (id) => {
		let t = getStudent(id)
		return t && t.level.charAt(0).toUpperCase() + t.level.substring(1)
	}

	const searchUsers = (search) => {
		if (!search) return []
		const result = get(store).filter(s => {
			const {parent_nickname, student_nickname, parent_phone} = s
			let search_texts = [parent_nickname, student_nickname, parent_phone]
			return search_texts.some(text => {
				if (text) {
					return text.toLowerCase().includes(search.toLowerCase())
				}
			})
		})
		return result
	}

	const getLessonDemand = () => {
		let result = big_class_mapper.all_levels.map(lv => ({
			level: lv,
			user_count: 0,
			few_ticker_user_count: 0,
			many_ticker_user_count: 0,
			new_user_count: 0
		}))
		get(store).forEach(s => {
			if (s.tt_t_amt > 0) {
				const level = s.level
				const obj = result.find(r => r.level === level)
				if (obj) {
					obj.user_count++
					if (s.tt_t_amt <= 6) {
						obj.new_user_count++
					} else if (s.r_t_amt  <= 6) {
						obj.few_ticker_user_count++
					} else if (s.r_t_amt > 6) {
						obj.many_ticker_user_count++
					}
				} else {
					console.log(`Warning: ${level} is not found from the default level list`)
				}
			}
		})
		result = result.sort((a,b) => {
			return a.level > b.level ? 1 : -1
		})
		return result
	}

	return {
		subscribe: store.subscribe,
		getStudent,
		getStudentName,
		getStudentLevel,
		getStudentAvatar,
		getGender,
		getLessonDemand,
		searchUsers,
		fetchData,
		set: store.set
	}
})()

export {student_store}