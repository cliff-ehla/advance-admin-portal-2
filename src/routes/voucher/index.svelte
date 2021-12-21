<script context="module">
	import {http, onFail} from "$lib/http";
	import dayjs from "dayjs";

	export const load = async ({fetch}) => {
		const {data, success, debug} = await http.post(fetch, '/voucherApi/list_pending_voucher')
		if (!success) return onFail(debug)
		return {
			props: {
				record_list: data
			}
		}
	}
</script>

<script>
	import Icon from '$lib/ui-elements/icon.svelte'
	import CreateVoucher from "$lib/voucher/create-voucher.svelte";
	import Dropdown from '$lib/ui-elements/dropdown3.svelte'
	import {getContext} from 'svelte'
	import CreateUserDialog from '$lib/student/create-new-user-dialog.svelte'
	import {tutor_store} from "../../store/tutor-store.js";
	import {calendar_store, action_status} from "../../store/calendar-action-status-store.js";
	import {dialog} from "$lib/store/dialog.js";
	import {tooltip} from "$lib/aciton/tooltip.js";
	import {goto} from "../../../.svelte-kit/dev/runtime/app/navigation.js";

	const {openModal, closeModal} = getContext('simple-modal')


	export let record_list
	const type_option = ['TICKET', 'COURSE', 'TRIAL']

	const openCreateTickerDialog = (row, parent) => {
		console.log(parent)
		dialog.confirm({
			message: `Add ticket to ${parent.nickname}`,
			onConfirm: () => {
				return http.post(fetch, '/courseApi/purchase_course_ticket', {
					parent_id: parent.user_id,
					voucher_id: row.id
				}, {
					notification: `成功增加Ticker俾${parent.user_id}`
				})
			},
			onSuccess: refresh
		})
	}

	const onCreateCourse = (row, student_id) => {
		const type = row.type
		if (type === 'TRIAL') {
			calendar_store.createTrial({
				student_id,
				teacher_id: row.teacher_id,
				voucher_id: row.id,
			})
		} else if (type === 'COURSE') {
			calendar_store.createCourse({
				student_id,
				teacher_id: row.teacher_id,
				voucher_id: row.id,
			})
		}
		goto(`/tutor/${row.teacher_id}`)
	}

	const onCreateVoucher = (option) => {
		openModal(CreateVoucher, {
			voucher_type: option,
			onSuccess: refresh
		}, {
			padding: '1em'
		})
	}

	const onCreateAccount = (parent_mobile) => {
		openModal(CreateUserDialog, {
			parent_mobile,
			onSuccess: refresh
		})
	}

	const refresh = async () => {
		const {data, success, debug} = await http.post(fetch, '/voucherApi/list_pending_voucher')
		record_list = data
	}
</script>

<table class="w-full mx-2">
	<tr class="sticky top-0 bg-white">
		<th class="text-left">Voucher No</th>
		<th>Date</th>
		<th>Type</th>
		<th>Phone</th>
		<th>用戶名箱</th>
		<th>老師</th>
		<th>課堂長度</th>
		<th>課堂數目</th>
		<th>課堂費用</th>
		<th>App費用</th>
		<th>總費用</th>
	</tr>
	{#if record_list.length}
		{#each record_list as r}
			<tr>
				<td class="text-left">{r.voucher_number}</td>
				<td>{dayjs(r.v_date).format('DD MMM YYYY (ddd)')}</td>
				<td>
					<img src="/{r.type.toLowerCase()}.png" alt="ticket" class="w-12" use:tooltip={r.type}>
				</td>
				<td>{r.phone}</td>
				<td>
					{#if r.related_users.length}
						{#each r.related_users as parent}
							<div class="p-1 bg-gray-100 mb-1">
								<div class="flex items-center whitespace-nowrap">
									<img src="/parent-icon.png" alt="p" class="w-4 h-4 rounded-full mr-2">
									<p>{parent.nickname}</p>
									{#if r.type === 'TICKET' && !r.reg_ticket_id}
										<button use:tooltip={'入卷俾家長'} on:click={() => {openCreateTickerDialog(r, parent)}} class="ml-auto bg-white mr-1 bg-white border-gray-300 border w-4 h-4 cc hover:text-blue-500">
											<Icon name="add" className="w-2"/>
										</button>
									{/if}
								</div>
								{#each parent.students as s}
									<div class="flex items-center">
										<img src="/student-m-icon.png" alt="p" class="w-4 h-4 rounded-full mr-2">
										<p>{s.nickname}</p>
										{#if (r.type === 'COURSE' || r.type === 'TRIAL') && !r.tutor_group_id}
											<button use:tooltip={'開堂俾細路'} on:click={() => {onCreateCourse(r, s.user_id)}} class="ml-auto bg-white mr-1 bg-white border-gray-300 border w-4 h-4 cc hover:text-blue-500">
												<Icon name="add" className="w-2"/>
											</button>
										{/if}
									</div>
								{/each}
							</div>
						{/each}
					{:else}
						<button class="button-secondary" on:click={() => {onCreateAccount(r.phone)}}>Create account</button>
					{/if}
				</td>
				<td>
					{#if r.teacher_nickname}
						<img use:tooltip={r.teacher_nickname} src={tutor_store.getTutorProfilePic(r.teacher_id)} alt="img" class="w-12 h-12 rounded-full">
					{/if}
				</td>
				<td>
					{#if r.lesson_duration}
						{r.lesson_duration}min
					{/if}
				</td>
				<td>
					{#if r.lesson_count}
						{r.lesson_count}
					{/if}
				</td>
				<td>${r.lesson_fee}</td>
				<td>${r.app_fee}</td>
				<td>${Number(r.app_fee) + Number(r.lesson_fee)}</td>
			</tr>
		{/each}
	{:else}
		<p class="p-4">no data</p>
	{/if}
</table>

<Dropdown activator_active_style="bg-blue-700" offset="8" placement="top-end"
          activator_style="fixed right-4 bottom-4 w-12 h-12 rounded-full flex items-center justify-center text-white bg-blue-500">
	<button slot="activator">
		<Icon name="add"/>
	</button>
	<div class="bg-white p-2 shadow-lg border border-gray-300 rounded">
		{#each type_option as option}
			<div on:click={() => {onCreateVoucher(option)}} class="cursor-pointer px-2 py-2 hover:bg-gray-100 hover:text-blue-500 flex items-center">
				<img src="/{option.toLowerCase()}.png" alt="img" class="w-6">
				<p class="ml-1">{option}</p>
			</div>
		{/each}
	</div>
</Dropdown>

<style>
	td, th {
		@apply p-1 border-b border-gray-200 text-left text-sm;
	}
</style>