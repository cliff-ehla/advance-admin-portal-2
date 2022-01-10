import {writable, derived} from "svelte/store";

export let user_info = writable({
	username: undefined
})

export let authorized = derived(user_info, $user_info => {
	return $user_info ? !!$user_info.username : false
})