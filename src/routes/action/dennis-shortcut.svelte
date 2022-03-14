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
	import {notifications} from "$lib/store/notification.js";

	dayjs.extend(utc)

	let parent_mobile = undefined
	let parent_nickname = undefined
	$: parent_username = parent_mobile
	let is_parent_username_valid = false
	const PASSWORD = '12345678'
	const child_obj = {
		username: '',
		nickname: '',
		password: PASSWORD,
		level: '',
		gender: '',
		is_username_valid: false,
		tutor_group_ids: ''
	}
	let childs = [
		{...child_obj}
	]
	let lesson_fee, app_fee = 0, remark
	let ticket_amt
	let payment_method
	let is_vip = true

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
	$: disabled = !(ticket_amt && payment_method && parent_mobile && parent_nickname && parent_username)
	$: {
		if (ticket_amt > 900) {
			is_vip = false
			notifications.info('多過900蚊就不需特別關注，自動off左先')
		}
	}

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

	const onNicknameInput = (e, child) => {
		child.username = e.target.value.toLowerCase().replace(' ', '')
		if (parent_mobile) {
			child.username += parent_mobile.substring(0,4)
		}
		if (childs.length > 1) {
			let first_child = childs[0].nickname
			let second_child = e.target.value
			parent_nickname = first_child.split(' ')[0] + ' and ' + second_child.split(' ')[0] + ' Parent'
		} else {
			parent_nickname = e.target.value + ' Parent'
		}
		callApi()
	}
</script>

<div class="w-full container py-4">
	<div class="text-sm text-gray-400 mb-2">
		<p class="mb-1">Parent mobile no</p>
		<input on:input={callApi2} bind:value={parent_mobile} type="text" class="border border-gray-300 rounded px-4 py-2 w-full">
	</div>
	<div class="mt-4">
		<div class="grid grid-cols-2 gap-4 mb-4">
			{#each childs as c, i}
				<div class="border border-gray-300 p-2 py-4 rounded">
					<div class="flex mb-2 justify-between">
						<p class="text-blue-500 text-xs">#0{i + 1} Child</p>
						{#if childs.length > 1}
							<button class="hover:text-red-500" on:click={() => {onRemoveChild(i)}}>
								<Icon name="close" className="w-3"/>
							</button>
						{/if}
					</div>

					<div>
						<div class="text-sm text-gray-400 mb-2">
							<p class="mb-1">Child nickname</p>
							<input on:input={(e) => {onNicknameInput(e, c)}} bind:value={c.nickname} type="text" class="border border-gray-300 rounded px-4 py-2 w-full">
						</div>
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
						<div class="text-sm text-gray-400 mb-2">
							<p class="mb-1">tutor_group_ids</p>
							<input bind:value={c.tutor_group_ids} type="text" class="border border-gray-300 rounded px-4 py-2 w-full">
						</div>

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
							<input on:input={callApi} bind:value={c.username} type="text" class="border border-gray-200 rounded px-4 py-2 w-full bg-gray-100">
						</div>
					</div>
				</div>
			{/each}
			<button class="h-full w-full text-center py-2 bg-gray-50 border border-gray-300 hover:bg-blue-50 hover:text-blue-500" on:click={onAddChild}>Add child</button>
		</div>

		<div class="border border-gray-300 p-2 py-4 rounded mb-2">
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
					<input bind:value={parent_username} type="text" class="border border-gray-200 rounded px-4 py-2 w-full bg-gray-100">
				</div>
				<div class="text-sm text-gray-400 mb-2">
					<p class="mb-1">Parent Nickname</p>
					<input bind:value={parent_nickname} type="text" class="border border-gray-200 rounded px-4 py-2 w-full bg-gray-100">
				</div>
			</div>
		</div>

		<div class="border border-gray-300 p-2 py-4 rounded mb-2">
			<div class="grid grid-cols-2 gap-4">
				<div>
					<label>Lesson fee</label>
					<input class="input block mb-2 w-full" type="number" placeholder="Lesson fee" on:input={e => {ticket_amt = e.target.value}} bind:value={lesson_fee}/>
				</div>
				<div>
					<label>App fee</label>
					<input class="input block mb-2 w-full" type="number" placeholder="App fee" bind:value={app_fee}/>
				</div>
			</div>
			<div class="my-2">
				<input type="checkbox" bind:checked={is_vip} id="extra_option" class="cursor-pointer">
				<label for="extra_option" class="cursor-pointer ml-2">特別關注</label>
			</div>
			<label>Payment method</label>
			<SelectionBox simple_array options={['Alipay', 'Bank Transfer', 'Payme']} selected_value={payment_method} on:input={e => {payment_method = e.detail}}/>
			<label>Remark</label>
			<textarea class="input block mb-2 w-full" placeholder="Remark" bind:value={remark}/>
		</div>
	</div>
	<div>
		<Button button_class="w-full py-2" disabled={disabled || $is_loading} on:click={onConfirm}>建立用戶</Button>
	</div>
</div>

<style>
	label {
		@apply text-sm text-gray-400 mb-2;
	}
</style>