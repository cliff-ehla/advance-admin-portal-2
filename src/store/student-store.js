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

	const getStudentAvatar = (id) => {
		let t = getStudent(id)
		let gender = t && t.gender
		return `/student-${gender}-icon.png`
	}

	const getStudentLevel = (id) => {
		let t = getStudent(id)
		return t && t.level
	}

	return {
		subscribe: store.subscribe,
		getStudent,
		getStudentName,
		getStudentLevel,
		getStudentAvatar,
		set: store.set
	}
})()

export {student_store}