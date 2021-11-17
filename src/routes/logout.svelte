<script>
	import {onMount} from 'svelte'
	import {logout} from "../api/user-api";
	import {goto} from '$app/navigation'

	onMount(async () => {
		await logout()
		goto('login')
	})
</script>