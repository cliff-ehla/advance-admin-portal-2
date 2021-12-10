import {writable, get} from "svelte/store";

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

	return {
		subscribe: store.subscribe,
		getStudent,
		getStudentName,
		getStudentLevel,
		getStudentAvatar,
		getGender,
		set: store.set
	}
})()

export {student_store}