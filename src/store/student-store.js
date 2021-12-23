import {writable, get, derived} from "svelte/store";
import {big_class_mapper} from "$lib/store/big-class-mapper.js";

const student_store = (() => {
	const store = writable([])

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
				obj.user_count++

				if (s.tt_t_amt <= 6) {
					obj.new_user_count++
				} else if (s.r_t_amt  <= 6) {
					obj.few_ticker_user_count++
				} else if (s.r_t_amt > 6) {
					obj.many_ticker_user_count++
				}
			}
		})
		result = result.sort((a,b) => {
			return a.level > b.level ? 1 : -1
		})
		return result
	}

	const getSummary = () => {
		const result = {
			total_students: 0,
			many_ticker_user_count: 0,
			few_ticker_user_count: 0,
			new_user_count: 0
		}

		get(store).forEach(s => {
			if (s.tt_t_amt > 0) {
				result.total_students++
				if (s.tt_t_amt <= 6) {
					result.new_user_count++
				} else if (s.r_t_amt  <= 6) {
					result.few_ticker_user_count++
				} else if (s.r_t_amt > 6) {
					result.many_ticker_user_count++
				}
			}
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
		getSummary,
		searchUsers,
		set: store.set
	}
})()

export {student_store}