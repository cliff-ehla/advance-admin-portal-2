<script>
	import {onMount} from 'svelte'
	import {goto} from "$app/navigation"
	import {getStores} from "$app/stores";
	import {http} from "$lib/http";
	const {session} = getStores()

	onMount(() => {
		http.post(fetch, '/user/logout')
		session.set({})
		goto('/login')
	})
</script>