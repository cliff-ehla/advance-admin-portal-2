import {writable, get} from "svelte/store";

const tutor_store = (() => {
	const store = writable([])

	const getTutorName = (id) => {
		let t = get(store).find(t => t.user_id == id)
		return t && t.nickname
	}

	const getTutorProfilePic = (id) => {
		let t = get(store).find(t => t.user_id == id)
		const profile_pic = t && t.profile_pic
		if (profile_pic) {
			return profile_pic
		} else {
			return '/pre-user-icon.png'
		}
	}

	return {
		subscribe: store.subscribe,
		getTutorName,
		getTutorProfilePic,
		set: store.set
	}
})()

export {tutor_store}