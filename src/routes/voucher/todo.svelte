<script context="module">
	import {http, onFail} from "$lib/http";

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
	import {notifications} from "$lib/store/notification";
	import CreateTrialDialog from "$lib/option/create-trial-lesson.dialog.svelte";
	import dayjs from "dayjs";
	import utc from "dayjs/plugin/utc.js";
	dayjs.extend(utc)

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
		const {type, reserved_grouper_ids} = row
		const reserved_grouper_id = reserved_grouper_ids && reserved_grouper_ids[0]
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
		if (reserved_grouper_id) {
			return openCreateCourseDialog(reserved_grouper_id)
		}
		goto(`/tutor/${row.teacher_id}`)
	}

	const openCreateCourseDialog = async (reserved_grouper_id) => {
		const {data, success, debug} = await http.post(fetch, '/zoomApi/list_zoom_trial_option')
		const items = data.filter(r => r.grouper_id === reserved_grouper_id && !r.auto_delete_date)
		if (!items.length) {
			notifications.alert('冇相應的 reserved_grouper_id: ' + reserved_grouper_id + ', 可能未 Confirm date')
		} else {
			const option = items[0]
			openModal(CreateTrialDialog, {
				course_title: option.course,
				start_date: option.reserves[0].start_date,
				end_date: option.reserves[0].end_date,
				reserved_id: option.reserves[0].reserved_id,
				onSuccess: () => {
					goto(`/tutor/${option.reserves[0].teacher_id}/${dayjs.utc(option.reserves[0].start_date).local().format('YYYY-MM')}`)
				}
			}, {
				width: '900px'
			})
		}
	}

	const onCreateVoucher = (option) => {
		openModal(CreateVoucher, {
			voucher_type: option,
			onSuccess: refresh
		})
	}

	const onCreateAccount = ({phone, reserved_grouper_id}) => {
		openModal(CreateUserDialog, {
			parent_mobile: phone,
			onSuccess: refresh
		})
	}

	const refresh = async () => {
		const {data, success, debug} = await http.post(fetch, '/voucherApi/list_pending_voucher')
		record_list = data
	}
</script>

<div class="p-4">
	<h1 class="text-xl mb-4">未完成Voucher</h1>
	<table class="w-full mx-2 mb-20">
		<tr class="sticky top-0 bg-white">
			<th class="text-left">Voucher No</th>
			<th>Date</th>
			<th>老師</th>
			<th>Type</th>
			<th>Phone</th>
			<th>用戶名箱</th>
			<th>課堂長度</th>
			<th>課堂數目</th>
			<th>課堂費用</th>
			<th>App費用</th>
			<th>總費用</th>
		</tr>
		{#if record_list.length}
			{#each record_list as r}
				<tr>
					<td class="w-28 text-left">{r.voucher_number}</td>
					<td class="w-36">
						<p class="leading-tight">{dayjs(r.create_ts).format('DD MMM YYYY (ddd)')}</p>
						<p class="leading-tight text-gray-500">{dayjs.utc(r.create_ts).local().format('h:mma')}</p>
						<p class="leading-tight text-gray-500 text-xs">by <span class="border-b border-black">{r.admin_username}</span></p>
					</td>
					<td>
						{#if r.teacher_nickname}
							<img use:tooltip={r.teacher_nickname} src={tutor_store.getTutorProfilePic(r.teacher_id)} alt="img" class="w-12 h-12 rounded-full">
						{/if}
					</td>
					<td class="w-20">
						<div class="relative inline-block">
							<img src="/{r.type.toLowerCase()}.png" alt="ticket" class="w-12" use:tooltip={r.type}>
							{#if r.reserved_grouper_ids && r.reserved_grouper_ids.length}
								<a href="/booking/option" class="absolute w-11 h-4 rounded bg-red-500 hover:bg-red-900 text-white cc -right-4 -top-1 flex" style="font-size: 9px">
									Option
									<Icon name="right" className="ml-0.5 flex-shrink-0 w-2"/>
								</a>
							{/if}
						</div>
					</td>
					<td class="w-24">{r.phone}</td>
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
						{:else if !(r.reserved_grouper_ids && r.reserved_grouper_ids.length)}
							<button class="button-secondary" on:click={() => {onCreateAccount(r)}}>Create account</button>
						{:else}
							<a href="/booking/option" class="text-blue-500">To option page</a>
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
</div>

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