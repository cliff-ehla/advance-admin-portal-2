<script>
	import dayjs from "dayjs";
	import utc from 'dayjs/plugin/utc.js'
	import {debounce} from 'debounce'
	import {checkUsername} from "../../api/user-api";
	import SelectionBox from '../ui-elements/selection-box.svelte'
	import {createNewStudent} from "../../api/admin-api";
	import {createEventDispatcher} from 'svelte'
	const dispatch = createEventDispatcher()
	import {level_options_store} from "../../store/level-options";

	dayjs.extend(utc)

	export let username
	export let nickname
	export let level
	export let gender
	export let parent_mobile
	export let remark
	let PASSWORD = '12345678'
	let parent_nickname

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
		const payload = {
			student_username: username,
			student_nickname: nickname,
			student_password: PASSWORD,
			parent_username: parent_username,
			parent_nickname,
			parent_password: PASSWORD,
			gender,
			level,
			parent_mobile,
			reminder: remark || ' '
		}
		loading = true
		let {child} = await createNewStudent(payload)
		dispatch('created', {
			user_id: child.user_id,
			gender,
			level,
			nickname
		})
		loading = false
	}
</script>

<div>
	<div class="mt-4">
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
			<p class="mb-1">Child nickname</p>
			<input bind:value={nickname} type="text" class="border border-gray-300 rounded px-4 py-2 w-full">
		</div>
		<div class="text-sm text-gray-400 mb-2">
			<p class="mb-1">Gender</p>
			<SelectionBox options={gender_options} selected_value={gender} on:input={e => {gender = e.detail}}/>
		</div>
		<div class="text-sm text-gray-400 mb-2">
			<p class="mb-1">Grade</p>
			<SelectionBox options={$level_options_store} selected_value={level} on:input={e => {level = e.detail}}/>
		</div>
		<div class="text-sm text-gray-400 mb-2">
			<p class="mb-1">Parent mobile no</p>
			<input bind:value={parent_mobile} type="text" class="border border-gray-300 rounded px-4 py-2 w-full">
		</div>
		<div class="text-sm text-gray-400 mb-2">
			<p class="mb-1">Parent Nickname</p>
			<input bind:value={parent_nickname} type="text" class="border border-gray-300 rounded px-4 py-2 w-full">
		</div>
		<div class="text-sm text-gray-400 mb-2">
			<p class="mb-1">Student note</p>
			<textarea class="px-2 py-4 w-full border border-gray-300 my-2" bind:value={remark} rows="2" placeholder="Remark (optional)"></textarea>
		</div>
	</div>
	<div class="mt-4">
		<button disabled={disabled || loading} on:click={onConfirm} class="{disabled || loading ? 'bg-gray-300 text-white' : 'bg-blue-500 text-white'} rounded-full px-4 py-3 w-full">Create new user</button>
	</div>
</div>