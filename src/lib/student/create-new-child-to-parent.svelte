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
	import {getContext} from 'svelte'
	const {openModal, closeModal} = getContext('simple-modal')

	dayjs.extend(utc)

	export let parent_id
	let username = undefined
	let nickname = undefined
	let level = undefined
	let gender = undefined
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
	let loading
	$: disabled = !(username && nickname && gender && level) || error

	const callApi = debounce(async () => {
		loading = true
		let success = await checkUsername(username)
		loading = false
		child_username_exist = !success
	}, 500)

	const onConfirm = async  () => {
		let {data} = await http.post(fetch, '/adminApi/create_student_in_parent', {
			student_username: username,
			student_nickname: nickname,
			student_password: PASSWORD,
			parent_id,
			gender,
			level,
			reminder: ''
		}, {
			notification: '成功加左個仔，你refresh 條list 就見到'
		})
		closeModal()
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
				<p class="mb-1">Gender</p>
				<SelectionBox options={gender_options} selected_value={gender} on:input={e => {gender = e.detail}}/>
			</div>
			<div class="text-sm text-gray-400 mb-2">
				<p class="mb-1">Grade</p>
				<SelectionBox options={$level_options_store} selected_value={level} on:input={e => {level = e.detail}}/>
			</div>
		</div>
	</div>
	<div>
		<Button button_class="w-full py-2" disabled={disabled || loading} on:click={onConfirm}>建立用戶</Button>
	</div>
</div>