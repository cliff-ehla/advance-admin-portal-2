import {writable, get} from "svelte/store";

const student_store = (() => {
	const store = writable([])

	const getStudentName = (id) => {
		let t = get(store).find(t => t.user_id == id)
		return t && t.nickname
	}

	const getStudentLevel = (id) => {
		let t = get(store).find(t => t.user_id == id)
		return t && t.level
	}

	return {
		subscribe: store.subscribe,
		getStudentName,
		getStudentLevel,
		set: store.set
	}
})()

export {student_store}