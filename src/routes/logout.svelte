<script>
	import {onMount} from 'svelte'
	import {goto} from "$app/navigation"
	import {getStores} from "$app/stores";
	const {session} = getStores()
	import {http} from "$lib/http";
	import {user_info} from "$lib/store/user_info.js";

	onMount(async () => {
		await http.post(fetch, '/user/logout')
		user_info.set(undefined)
		session.set({})
		await goto('/login')
	})
</script>