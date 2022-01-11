<script>
	import {http} from "$lib/http.js";

	export let voucher_list
	import dayjs from "dayjs";
	import utc from "dayjs/plugin/utc.js";
	import {tooltip} from "$lib/aciton/tooltip.js";
	import Icon from "$lib/ui-elements/icon.svelte"
	import {tutor_store} from "../../store/tutor-store.js";
	import SelectionBox from '$lib/ui-elements/selection-box.svelte'
	import Dropdown from '$lib/ui-elements/dropdown3.svelte'
	import {dialog} from "$lib/store/dialog.js";
	import {calendar_store} from "../../store/calendar-action-status-store.js";
	import {goto} from "$app/navigation";
	import {notifications} from "$lib/store/notification.js";
	import CreateTrialDialog from "$lib/option/create-trial-lesson.dialog.svelte";
	import CreateUserDialog from '$lib/student/create-new-user-dialog.svelte'
	import {triggerReload} from "$lib/helper/trigger-reload.js";
	import {getContext} from 'svelte'
	import CopyMessageTextBox from '$lib/ui-elements/copy-text.svelte'
	const {openModal, closeModal} = getContext('simple-modal')

	let sort_by_field = 'create_ts'

	$: sorted_voucher_list = voucher_list.sort((a,b) => {
		return a[sort_by_field] > b[sort_by_field] ? 1 : -1
	})

	dayjs.extend(utc)

	const isTodo = (r) => {
		if (r.type === 'TICKET' && !r.reg_ticket_id) return false
		if ((r.type === 'COURSE' || r.type === 'TRIAL') && !r.tutor_group_id) return false
		return true
	}

	const onChangeStatus = async (r, e) => {
		await http.post(fetch, '/voucherApi/set_voucher_status', {
			check_status: e.detail,
			id: r.id
		}, {
			notification: '已更新了status'
		})
		r.check_status = e.detail
		voucher_list = voucher_list
	}

	const onChangePayment = async (r, e) => {
		await http.post(fetch, '/voucherApi/edit_voucher', {
			id: r.id,
			payment_method: e.detail
		}, {
			notification: '已更新了payment method'
		})
		r.payment_method = e.detail
		voucher_list = voucher_list
	}

	const onEditField = (voucher, field = 'remark') => {
		dialog.confirm({
			title: `更改${field}`,
			text_input: {
				value: voucher[field],
				placeholder: field
			},
			onConfirm: async ({text_input}) => {
				await http.post(fetch, '/voucherApi/edit_voucher', {
					id: voucher.id,
					[field]: text_input,
					is_invalid: false
				}, {
					notification: `已經更新了${field}`
				})
			},
			onSuccess: triggerReload
		})
	}

	const onDelete = async (voucher) => {
		dialog.confirm({
			message: '報銷呢張Voucher？',
			onConfirm: async () => {
				await http.post(fetch, '/voucherApi/edit_voucher', {
					id: voucher.id,
					is_invalid: true
				}, {
					notification: '已經報銷'
				})
			},
			onSuccess: triggerReload
		})
	}

	const openCreateTickerDialog = (row, parent) => {
		dialog.confirm({
			message: `Add ticket to ${parent.nickname}`,
			checkbox: '是否特別關注學生?',
			onConfirm: ({checked}) => {
				return http.post(fetch, '/courseApi/purchase_course_ticket', {
					parent_id: parent.user_id,
					voucher_id: row.id,
					is_trial_vip: checked
				}, {
					notification: `成功增加Ticker俾${parent.user_id}`
				})
			},
			onSuccess: triggerReload
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

	const onCreateAccount = ({phone, reserved_grouper_id}) => {
		openModal(CreateUserDialog, {
			parent_mobile: phone,
			onSuccess: triggerReload
		})
	}
</script>

<div class="">
	<table>
		<tr class="sticky top-0 bg-white z-50 shadow">
			<th style="min-width: 145px" class="text-left">Voucher No</th>
			<th class="text-left">Phone</th>
			<th>User</th>
			<th class="cursor-pointer" on:click={() => {sort_by_field = 'create_ts'}}>
				<div class="flex items-center">
					<p>Date</p>
					<button class="sort-button" class:active={sort_by_field === 'create_ts'}>
						<Icon name="sort" className="w-3"/>
					</button>
				</div>
			</th>
			<th>Parent</th>
			<th>Teacher</th>
			<th>Detail</th>
			<th on:click={() => {sort_by_field = 'payment_method'}}>
				<div class="flex items-center cursor-pointer">
					<p>Payment</p>
					<button class="sort-button" class:active={sort_by_field === 'payment_method'}>
						<Icon name="sort" className="w-3"/>
					</button>
				</div>
			</th>
			<th>Remark</th>
			<th>Status</th>
			<th on:click={() => {sort_by_field = 'lesson_fee'}}>
				<div class="flex items-center cursor-pointer">
					<p>Lesson fee</p>
					<button class="sort-button" class:active={sort_by_field === 'lesson_fee'}>
						<Icon name="sort" className="w-3"/>
					</button>
				</div>
			</th>
			<th>App fee</th>
			<th>Total fee</th>
			<td></td>
		</tr>

		{#if sorted_voucher_list.length}
			{#each sorted_voucher_list as r}
				<tr class="align-middle" class:invalid={r.is_invalid}>
					<td class="text-left text-blue-800 whitespace-nowrap">
						<div class="relative">
							<CopyMessageTextBox value={r.voucher_number}/>
							{#if !isTodo(r)}
								<div class="w-2 h-2 rounded-full bg-red-500 absolute -top-1.5 -left-1"></div>
							{/if}
						</div>
					</td>
					<td class="font-bold text-gray-700 whitespace-nowrap">{r.phone}</td>
					<td class="text-gray-700 whitespace-nowrap">
						{#if r.related_users.length}
							{#each r.related_users as user}
								<div class="flex">
									<p use:tooltip={'parent'}>{user.nickname}</p>
									{#if r.type === 'TICKET' && !r.reg_ticket_id}
										<button use:tooltip={'入卷俾家長'} on:click={() => {openCreateTickerDialog(r, user)}} class="ml-2 bg-white border-red-500 text-red-500 border w-4 h-4 cc hover:bg-red-100">
											<Icon name="add" className="w-2"/>
										</button>
									{/if}
								</div>
								<div class="pl-2 border-l border-gray-500">
									{#each user.students as student}
										<div class="flex">
											<a use:tooltip={'child'} href="/students/{student.user_id}" class="text-xs hover:text-blue-500">{student.nickname}</a>
											{#if (r.type === 'COURSE' || r.type === 'TRIAL') && !r.tutor_group_id}
												<button use:tooltip={'開堂俾細路'} on:click={() => {onCreateCourse(r, student.user_id)}} class="ml-2 bg-white border-red-500 text-red-500 border w-4 h-4 cc hover:bg-red-100">
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
						<p class="leading-tight">{dayjs(r.create_ts).format('DD MMM YYYY (ddd)')}</p>
						<p class="text-gray-500 text-sm leading-tight">{dayjs.utc(r.create_ts).local().format('h:mma')}</p>
						<p class="text-gray-500 text-xs leading-tight">by ~{r.admin_username}</p>
					</td>
					<td>
						<img src="/{r.type.toLowerCase()}.png" alt="ticket" class="w-8 h-8 flex" use:tooltip={r.type}>
					</td>
					<td>
						{#if r.teacher_nickname}
							<img use:tooltip={r.teacher_nickname} src={tutor_store.getTutorProfilePic(r.teacher_id)} alt="img" class="w-8 h-8 rounded-full inline-flex">
						{/if}
					</td>
					<td>
						{#if r.type === 'TICKET'}
							<p>{r.ticket_amt} <span class="text-xs">Tickets</span></p>
							<p class="text-xs text-gray-500 whitespace-nowrap">
								{#if r.ticket_expiry_date}
									Exp: {dayjs(r.ticket_expiry_date).format('DD MMM YYYY')}
								{:else}
									- no expiry date -
								{/if}
							</p>
						{:else if r.type === 'TRIAL'}
							<p>{r.lesson_duration}min</p>
						{:else if r.type === 'COURSE'}
							<p>{r.lesson_cnt} lesson(s)</p>
							<p class="text-xs text-gray-500">Length: {r.lesson_duration}min</p>
						{/if}
					</td>
					<td>
						<SelectionBox simple_array options={['Alipay', 'Bank Transfer', 'Payme']} selected_value={r.payment_method} on:input={e => onChangePayment(r, e)}/>
					</td>
					<td>
						{#if r.remark}
							<div on:click={() => {onEditField(r, 'remark')}} class="items-center cursor-pointer hover:bg-gray-100 inline-block rounded p-2">
								<Icon name="message" className="w-4 text-green-500 inline"/>
								<span class="text-gray-500 text-sm">{r.remark}</span>
							</div>
						{:else}
							<p on:click={() => {onEditField(r, 'remark')}} class="text-sm text-gray-300 p-2 hover:bg-gray-100 cursor-pointer inline-block rounded">-No remark-</p>
						{/if}
					</td>
					<td>
						<SelectionBox simple_array options={['EMPTY', 'DONE', 'ERROR']} selected_value={r.check_status} on:input={e => onChangeStatus(r, e)}/>
					</td>
					<td>
						<div class="text-sm p-2 hover:bg-gray-100 cursor-pointer inline-block rounded" on:click={() => {onEditField(r, 'lesson_fee')}}>
							${r.lesson_fee}
						</div>
					</td>
					<td>
						<div class="text-sm p-2 hover:bg-gray-100 cursor-pointer inline-block rounded" on:click={() => {onEditField(r, 'app_fee')}}>
							${r.app_fee}
						</div>
					</td>
					<td>${Number(r.app_fee) + Number(r.lesson_fee)}</td>
					<td>
						<Dropdown placement="bottom-end" activator_style="w-8 h-8 cc rounded-full text-gray-500 border border-transparent transition" activator_active_style="bg-gray-100 text-blue-500 border-gray-300">
							<div slot="activator"><Icon className="w-4" name="more"/></div>
							<div class="dropdown">
								<button class="item" on:click={() => {onDelete(r)}}>Delete</button>
							</div>
						</Dropdown>
					</td>
				</tr>
			{/each}
		{:else}
			<p class="p-4">no data</p>
		{/if}
	</table>
</div>

<style>
	td, th {
		@apply p-2 border-b border-gray-200 text-left text-sm;
	}
	th {
		@apply leading-tight;
	}
	.invalid {
		@apply cursor-not-allowed pointer-events-none opacity-20;
	}
	.sort-button {
		@apply ml-auto w-4 h-4 rounded-full flex items-center justify-center;
	}
	.sort-button.active {
		@apply bg-gray-100 text-blue-500;
	}
</style>