<script>
	import {login} from '../api/user-api'
	import {goto} from '$app/navigation'
	import {onMount} from 'svelte'
	import {getCookie} from "../helpers/cookie";
	let env = import.meta.env.VITE_ENV
	let base_url = import.meta.env.VITE_API_BASE
	let local_production = base_url === 'https://usermodel.ehlacademy.org'

	let username = env === 'production' ? '' : local_production ? 'ehla.admin' : 'queeniedevadmin'
	let password = env === 'production' ? '' : local_production ? 'e12345678' : 'q12345678'
	let error = false

	const onLogin = async () => {
		try {
			await login({username, password})
			goto('tutor')
		} catch (e) {
			console.log(e)
			error = true
		}
	}

	onMount(() => {
		if (getCookie('token')) {
			goto('tutor')
		}
	})
</script>

<div class="pt-16 pb-32 mx-4">
	<div class="max-w-screen-sm mx-auto bg-white rounded-lg py-8 px-4 sm:px-16">
		<div>
			<h1 class="font-bold mb-4 text-xl text-center">Log in</h1>
			<div class="mb-4">
				<input type="text" placeholder="Username" class="border border-gray-300 p-4 w-full" bind:value={username}>
			</div>
			<div>
				<input type="password" placeholder="Password" class="border border-gray-300 p-4 w-full" bind:value={password}>
			</div>
			{#if error}
				<p class="text-red-500 py-2">Password and username not match</p>
			{/if}
			<div class="mt-8 flex justify-end mb-4">
				<button on:click={onLogin} class="bg-blue-500 text-white p-4 rounded">Log in</button>
			</div>
		</div>
	</div>
</div>