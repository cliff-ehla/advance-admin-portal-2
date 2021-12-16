import {writable, get} from "svelte/store";
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

	const getLessonDemand = () => {
		let result = big_class_mapper.all_levels.map(lv => ({
			level: lv,
			user_count: 0,
			few_ticker_user_count: 0,
			many_ticker_user_count: 0,
			lesson_demand: 0
		}))
		get(store).forEach(s => {
			if (s.r_t_amt > 0) {
				const level = s.level
				const obj = result.find(r => r.level === level)
				obj.user_count++
				obj.lesson_demand += Math.min(s.r_t_amt, 8)
				if (s.r_t_amt > 6) {
					obj.many_ticker_user_count++
				} else {
					obj.few_ticker_user_count++
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
		set: store.set
	}
})()

export {student_store}