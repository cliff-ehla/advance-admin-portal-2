<script>
	import {http} from "$lib/http";
	import {goto} from '$app/navigation'
	import Button from '$lib/ui-elements/button.svelte'
	import {user_info} from "$lib/store/user_info.js";
	import {sentry} from "$lib/sentry.js";

	let env = import.meta.env.VITE_ENV
	let base_url = import.meta.env.VITE_API_BASE
	let local_production = base_url === 'https://usermodel.ehlacademy.org'

	let username = env === 'production' ? '' : local_production ? 'cliff.admin' : 'queeniedevadmin'
	let password = env === 'production' ? '' : local_production ? '12345678' : 'q12345678'
	let error = false

	const onLogin = async () => {
		let {data, success} = await http.post(fetch, '/user/login', {
			username,
			password
		})
		if (success) {
			user_info.set({
				username: data.username,
				nickname: data.nickname
			})
			sentry.setUser({
				username: data.username,
				nickname: data.nickname
			})
			goto('/dashboard')
		} else {
			error = true
		}
	}
</script>

<div class="pt-16 pb-32 mx-4">
	<div class="max-w-screen-sm mx-auto bg-white rounded-lg py-8 px-4 sm:px-16">
		<div>
			<div class="flex items-end mt-20 mb-4">
				<div class="flex items-center mb-4">
					<img src="/logo.png" alt="login" class="w-12">
					<h1 class="font-bold text-xl ml-4">EHLA Admin</h1>
				</div>
				<div class="ml-auto"><img src="/admin-login-robot.jpg" alt="login" class="w-40 mx-auto"></div>
			</div>
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
				<Button on:click={onLogin}>登入</Button>
			</div>
		</div>
	</div>
</div>