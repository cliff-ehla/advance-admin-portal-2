<script>
	import dayjs from "dayjs";
	import utc from 'dayjs/plugin/utc.js'
	import {debounce} from 'debounce'
	import SelectionBox from '$lib/ui-elements/selection-box.svelte'
	import Button from '$lib/ui-elements/button.svelte'
	import Icon from '$lib/ui-elements/icon.svelte'
	import {http} from "$lib/http";
	import {createEventDispatcher} from 'svelte'
	const dispatch = createEventDispatcher()
	import {level_options_store} from "../../store/level-options";
	import {student_store} from "../../store/student-store.js";
	import {is_loading} from "$lib/store/is_loading";
	import {capitalize} from "$lib/helper/capitalize.js";
	import {notifications} from "$lib/store/notification.js";

	dayjs.extend(utc)

	let parent_mobile = undefined
	let parent_nickname = undefined
	let parent_username = parent_mobile
	let is_parent_username_valid = false
	const PASSWORD = '12345678'
	const child_obj = {
		username: '',
		nickname: '',
		password: PASSWORD,
		level: '',
		gender: '',
		reminder: '',
		is_username_valid: false
	}
	let childs = [
		{...child_obj}
	]

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
	$: disabled = !(parent_mobile && parent_nickname)

	const callApi = debounce(async () => {
		let promise_array = []
		childs.forEach(c => {
			promise_array.push(http.post(fetch,'/user/username_check',{
				username: c.username
			}))
		})
		let results = await Promise.all(promise_array)
		results.forEach((res, i) => {
			childs[i].is_username_valid = res.success
			childs[i].nickname = capitalize(childs[i].username)
			parent_nickname = capitalize(childs[i].username) + ' Parent'
		})
		childs = childs
	}, 500)

	const callApi2 = debounce(async () => {
		const {success} = await http.post(fetch,'/user/username_check',{
			username: parent_username
		})
		if (/^\d+$/.test(parent_username)) {
			parent_mobile = parent_username
		} else {
			notifications.alert('家長username個practice係入電話')
		}
		is_parent_username_valid = success
	}, 500)

	const onConfirm = async  () => {
		let {data} = await http.post(fetch, '/adminApi/create_parent_students', {
			students: childs,
			parent_username: parent_username,
			parent_nickname,
			parent_password: PASSWORD,
			parent_mobile
		}, {
			notification: '成功創建用戶'
		})
		dispatch('created', {
			childs: data.childs
		})
		await student_store.fetchData(fetch)
	}

	const onAddChild = () => {
		childs.push({...child_obj})
		childs = childs
	}

	const onRemoveChild = (i) => {
		childs.splice(i, 1)
		childs = childs
	}
</script>

<div class="w-full">
	<div class="mt-4">
		{#each childs as c, i}
			<div class="bg-gray-100 p-2 py-4 rounded mb-2">
				<div class="flex mb-2 justify-between">
					<p class="text-blue-500 text-xs">#0{i + 1} Child</p>
					{#if childs.length > 1}
						<button class="hover:text-red-500" on:click={() => {onRemoveChild(i)}}>
							<Icon name="close" className="w-3"/>
						</button>
					{/if}
				</div>
				<div class="grid grid-cols-2 gap-4">
					<div class="text-sm text-gray-400 mb-2">
						<div class="flex">
							<p class="mb-1">Username</p>
							<div class="ml-4">
								{#if !!c.username}
									{#if $is_loading}
										loading...
									{:else if !c.is_username_valid}
										<p class="text-red-500">已有人用 :(</p>
									{:else}
										<p class="text-green-500">ok!</p>
									{/if}
								{/if}
							</div>
						</div>
						<input on:input={callApi} bind:value={c.username} type="text" class="border border-gray-300 rounded px-4 py-2 w-full">
					</div>
					<div class="text-sm text-gray-400 mb-2">
						<p class="mb-1">Child nickname</p>
						<input bind:value={c.nickname} type="text" class="border border-gray-300 rounded px-4 py-2 w-full">
					</div>
				</div>

				<div class="grid grid-cols-2 gap-4">
					<div class="text-sm text-gray-400 mb-2">
						<p class="mb-1">Gender</p>
						<SelectionBox options={gender_options}
						              selected_value={c.gender}
						              on:input={e => {c.gender = e.detail}}/>
					</div>
					<div class="text-sm text-gray-400 mb-2">
						<p class="mb-1">Grade</p>
						<SelectionBox options={$level_options_store}
						              selected_value={c.level}
						              on:input={e => {c.level = e.detail}}/>
					</div>
				</div>
				<div class="text-sm text-gray-400 mb-2">
					<p class="mb-1">Student note</p>
					<textarea class="p-2 w-full border border-gray-300" bind:value={c.reminder} rows="2" placeholder="Remark (optional)"></textarea>
				</div>
			</div>
		{/each}
		<div class="mb-2">
			<button class="w-full text-center py-2 bg-gray-100 border border-gray-300 hover:bg-blue-500 hover:text-white" on:click={onAddChild}>Add child</button>
		</div>

		<div class="bg-gray-100 p-2 py-4 rounded mb-2">
			<p class="text-blue-500 text-xs mb-2">Parent</p>
			<div class="grid grid-cols-2 gap-4">
				<div class="text-sm text-gray-400 mb-2">
					<div class="flex">
						<p class="mb-1">Username</p>
						<div class="ml-4">
							{#if !!parent_username}
								{#if $is_loading}
									loading...
								{:else if !is_parent_username_valid}
									<p class="text-red-500">已有人用 :(</p>
								{:else}
									<p class="text-green-500">ok!</p>
								{/if}
							{/if}
						</div>
					</div>
					<input on:input={callApi2} bind:value={parent_username} type="text" class="border border-gray-300 rounded px-4 py-2 w-full">
				</div>
				<div class="text-sm text-gray-400 mb-2">
					<p class="mb-1">Parent Nickname</p>
					<input bind:value={parent_nickname} type="text" class="border border-gray-300 rounded px-4 py-2 w-full">
				</div>
			</div>
			<div class="text-sm text-gray-400 mb-2">
				<p class="mb-1">Parent mobile no</p>
				<input bind:value={parent_mobile} type="text" class="border border-gray-300 rounded px-4 py-2 w-full">
			</div>
		</div>
	</div>
	<div>
		<Button button_class="w-full py-2" disabled={disabled || $is_loading} on:click={onConfirm}>建立用戶</Button>
	</div>
</div>