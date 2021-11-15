import {writable, get} from "svelte/store";

const tutor_store = (() => {
	const store = writable([])

	const getTutorName = (id) => {
		let t = get(store).find(t => t.user_id == id)
		return t && t.nickname
	}

	return {
		subscribe: store.subscribe,
		getTutorName,
		set: store.set
	}
})()

export {tutor_store}