<script>
	import {onMount} from 'svelte'
	import {goto} from "$app/navigation"
	import {getStores} from "$app/stores";
	const {session} = getStores()
	import {http} from "$lib/http";
	import {sentry} from "$lib/sentry";
	import {user_info} from "$lib/store/user_info.js";

	onMount(async () => {
		await http.post(fetch, '/user/logout')
		user_info.set(undefined)
		sentry.clearUser()
		session.set({})
		await goto('/login')
	})
</script>