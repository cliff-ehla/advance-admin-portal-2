<script>
	import dayjs from "dayjs";
	import utc from 'dayjs/plugin/utc.js'
	import {debounce} from 'debounce'
	import {checkUsername} from "../../api/user-api";
	import SelectionBox from '$lib/ui-elements/selection-box.svelte'
	import Button from '$lib/ui-elements/button.svelte'
	import {http} from "$lib/http";
	import {createEventDispatcher} from 'svelte'
	const dispatch = createEventDispatcher()
	import {level_options_store} from "../../store/level-options";
	import {student_store} from "../../store/student-store.js";

	dayjs.extend(utc)

	export let username = undefined
	export let nickname = undefined
	export let level = undefined
	export let gender = undefined
	export let parent_mobile = undefined
	export let parent_nickname = undefined
	let PASSWORD = '12345678'

	let gender_options = [
		{
			label: 'Male',
			value: 'm'
		},
		{
			label: 'Female',
			value: 'f'
		},
		{
			label: 'NA',
			value: 'na'
		}
	]

	let error
	let child_username_exist
	let parent_username_exist
	let loading
	let parent_username = parent_mobile
	$: disabled = !(username && nickname && gender && level && parent_mobile && parent_nickname) || error

	const callApi = debounce(async () => {
		loading = true
		console.log('parent_username', parent_username)
		let parent_success = checkUsername(parent_username)
		let std_success = checkUsername(username)
		let results = await Promise.all([parent_success, std_success])
		parent_username_exist = !results[0]
		child_username_exist = !results[1]
		let success = results.every(r => !!r)
		loading = false
		error = !success
	}, 500)

	const onConfirm = async  () => {
		let {data} = await http.post(fetch, '/adminApi/create_parent_student', {
			student_username: username,
			student_nickname: nickname,
			student_password: PASSWORD,
			parent_username: parent_username,
			parent_nickname,
			parent_password: PASSWORD,
			gender,
			level,
			parent_mobile
		}, {
			notification: '成功創建用戶'
		})
		dispatch('created', {
			user_id: data.child.user_id,
			gender,
			level,
			nickname,
			username
		})
		await student_store.fetchData(fetch)
	}
</script>

<div class="w-full">
	<div class="mt-4">
		<div class="grid grid-cols-2 gap-4">
			<div class="text-sm text-gray-400 mb-2">
				<div class="flex">
					<p class="mb-1">Child username</p>
					<div class="ml-4">
						{#if loading}
							loading...
						{:else if child_username_exist}
							<p class="text-red-500">username exist :(</p>
						{:else if !!username}
							<p class="text-green-500">ok!</p>
						{/if}
					</div>
				</div>
				<input bind:value={username} on:input={callApi} type="text" class="border border-gray-300 rounded px-4 py-2 w-full">
			</div>
			<div class="text-sm text-gray-400 mb-2">
				<p class="mb-1">Child nickname</p>
				<input bind:value={nickname} type="text" class="border border-gray-300 rounded px-4 py-2 w-full">
			</div>
		</div>

		<div class="grid grid-cols-2 gap-4">
			<div class="text-sm text-gray-400 mb-2">
				<div class="flex">
					<p class="mb-1">Parent username</p>
					<div class="ml-4">
						{#if loading}
							loading...
						{:else if parent_username_exist}
							<p class="text-red-500">username exist :(</p>
						{:else if !!parent_username}
							<p class="text-green-500">ok!</p>
						{/if}
					</div>
				</div>
				<input on:input={callApi} bind:value={parent_username} type="text" class="border border-gray-300 rounded px-4 py-2 w-full">
			</div>
			<div class="text-sm text-gray-400 mb-2">
				<p class="mb-1">Parent Nickname</p>
				<input bind:value={parent_nickname} type="text" class="border border-gray-300 rounded px-4 py-2 w-full">
			</div>
		</div>

		<div class="grid grid-cols-2 gap-4">
			<div class="text-sm text-gray-400 mb-2">
				<p class="mb-1">Gender</p>
				<SelectionBox options={gender_options} selected_value={gender} on:input={e => {gender = e.detail}}/>
			</div>
			<div class="text-sm text-gray-400 mb-2">
				<p class="mb-1">Grade</p>
				<SelectionBox options={$level_options_store} selected_value={level} on:input={e => {level = e.detail}}/>
			</div>
		</div>
		<div class="text-sm text-gray-400 mb-2">
			<p class="mb-1">Parent mobile no</p>
			<input bind:value={parent_mobile} type="text" class="border border-gray-300 rounded px-4 py-2 w-full">
		</div>
	</div>
	<div>
		<Button button_class="w-full py-2" disabled={disabled || loading} on:click={onConfirm}>建立用戶</Button>
	</div>
</div>