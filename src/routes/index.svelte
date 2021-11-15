<script>
	import {onMount} from 'svelte'
	import {getCookie} from "../helpers/cookie";
	import {goto} from '$app/navigation'

	onMount(() => {
		if (getCookie('token')) {
			goto('tutor')
		} else {
			goto('login')
		}
	})
</script>

<svelte:head>
	<title>Admin portal</title>
</svelte:head>
