<script>
	import {http} from "$lib/http.js";

	export let voucher_list
	import dayjs from "dayjs";
	import utc from "dayjs/plugin/utc.js";
	import {tooltip} from "$lib/aciton/tooltip.js";
	import Icon from "$lib/ui-elements/icon.svelte"
	import {tutor_store} from "../../store/tutor-store.js";
	import SelectionBox from '$lib/ui-elements/selection-box.svelte'
	import {dialog} from "$lib/store/dialog.js";
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

	const onEditRemark = (voucher) => {
		dialog.confirm({
			title: '更改Remark',
			text_input: {
				value: voucher.remark,
				placeholder: 'Remark'
			},
			onConfirm: async ({text_input}) => {
				await http.post(fetch, '/voucherApi/edit_voucher', {
					id: voucher.id,
					remark: text_input,
					is_invalid: false
				}, {
					notification: '已經更新了Remark'
				})
			},
			onSuccess: ({text_input}) => {
				voucher.remark = text_input
				voucher_list = voucher_list
			}
		})
	}
</script>

<tr class="sticky top-0 bg-white">
	<th class="text-left">Voucher No</th>
	<th class="text-left">Phone</th>
	<th>User</th>
	<th>Date</th>
	<th>Parent</th>
	<th>Teacher</th>
	<th>Detail</th>
	<th>Payment</th>
	<th>Remark</th>
	<th>Status</th>
	<th>Lesson fee</th>
	<th>App fee</th>
	<th>Total fee</th>
</tr>

{#if voucher_list.length}
	{#each voucher_list as r}
		<tr class="align-middle">
			<td class="text-left text-blue-800 whitespace-nowrap">
				{#if !isTodo(r)}
					<a href="/voucher/todo" class="relative hover:bg-blue-500 hover:text-white rounded px-2">
						{r.voucher_number}
						<div class="w-2 h-2 rounded-full bg-red-500 absolute -top-1.5 -left-1"></div>
					</a>
				{:else}
					{r.voucher_number}
				{/if}
			</td>
			<td class="font-bold text-gray-700 whitespace-nowrap">{r.phone}</td>
			<td class="text-gray-700 whitespace-nowrap">
				{#each r.related_users as user}
					<p use:tooltip={'parent'}>{user.nickname}</p>
					<div class="pl-2 border-l border-gray-500">
						{#each user.students as student}
							<a use:tooltip={'child'} href="/students/{student.user_id}" class="text-xs hover:text-blue-500">{student.nickname}</a>
						{/each}
					</div>
				{/each}
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
					<p>x{r.ticket_amt} <span class="text-xs">張飛</span></p>
					<p class="text-xs text-gray-500">
						{#if r.ticket_expiry_date}
							Exp: {dayjs(r.ticket_expiry_date).format('DD MMM YYYY')}
						{:else}
							- no expiry date -
						{/if}
					</p>
				{:else if r.type === 'TRIAL'}
					<p>{r.lesson_duration}min</p>
				{:else if r.type === 'COURSE'}
					<p>{r.lesson_duration}min</p>
					<p>x {r.lesson_cnt}堂</p>
				{/if}
			</td>
			<td>
				{#if r.payment_method}
					{r.payment_method}
				{:else}
					<span class="text-gray-300">n/a</span>
				{/if}
			</td>
			<td style="max-width: 300px; min-width: 300px">
				{#if r.remark}
					<div on:click={() => {onEditRemark(r)}} class="items-center cursor-pointer hover:bg-gray-100 inline-block rounded p-2">
						<Icon name="message" className="w-4 text-green-500 inline"/>
						<span class="text-gray-500 text-sm">{r.remark}</span>
					</div>
				{:else}
					<p class="text-sm text-gray-300">-No remark-</p>
				{/if}
			</td>
			<td>
				<SelectionBox simple_array options={['EMPTY', 'DONE', 'ERROR']} selected_value={r.check_status} on:input={e => onChangeStatus(r, e)}/>
			</td>
			<td>${r.lesson_fee}</td>
			<td>${r.app_fee}</td>
			<td>${Number(r.app_fee) + Number(r.lesson_fee)}</td>
		</tr>
	{/each}
{:else}
	<p class="p-4">no data</p>
{/if}

<style>
	td, th {
		@apply p-2 border-b border-gray-200 text-left text-sm;
	}
</style>