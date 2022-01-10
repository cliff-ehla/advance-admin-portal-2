<script>
	import {onMount} from 'svelte'
	import {goto} from "$app/navigation"
	import {getStores} from "$app/stores";
	const {session} = getStores()
	import {http} from "$lib/http";

	onMount(() => {
		http.post(fetch, '/user/logout')
		session.set({})
		goto('/login')
	})
</script>