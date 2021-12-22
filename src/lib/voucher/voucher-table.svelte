<script>
	export let voucher_list
	import dayjs from "dayjs";
	import utc from "dayjs/plugin/utc.js";
	import {tooltip} from "$lib/aciton/tooltip.js";
	import Icon from "$lib/ui-elements/icon.svelte"
	import {tutor_store} from "../../store/tutor-store.js";
	dayjs.extend(utc)

	const isTodo = (r) => {
		if (r.type === 'TICKET' && !r.reg_ticket_id) return false
		if ((r.type === 'COURSE' || r.type === 'TRIAL') && !r.tutor_group_id) return false
		return true
	}
</script>

<tr class="sticky top-0 bg-white">
	<th class="text-left">Voucher No</th>
	<th class="text-left">Phone</th>
	<th>Date</th>
	<th>Parent</th>
	<th>Teacher</th>
	<th>Detail</th>
	<th>Remark</th>
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
			<td>
				<p class="leading-tight">{dayjs(r.create_ts).format('DD MMM YYYY (ddd)')}</p>
				<p class="text-gray-500 text-sm leading-tight">{dayjs(r.create_ts).format('h:mma')}</p>
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
			<td style="max-width: 300px; min-width: 300px">
				{#if r.remark}
					<div class="items-center">
						<Icon name="message" className="w-4 text-green-500 inline"/>
						<span class="text-gray-500 text-sm">{r.remark}</span>
					</div>
				{:else}
					<p class="text-sm text-gray-300">-No remark-</p>
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

<style>
	td, th {
		@apply p-2 border-b border-gray-200 text-left text-sm;
	}
</style>