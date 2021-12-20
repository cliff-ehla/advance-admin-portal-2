<script context="module">
	import {http, onFail} from "$lib/http";
	import dayjs from "dayjs";

	export const load = async ({page, fetch}) => {
		let start_date = `${page.params.yyyy}-${page.params.mm}-01 00:00:00`
		const {data, success, debug} = await http.post(fetch, '/voucherApi/list_voucher', {
			start_date: dayjs(start_date).format('YYYY-MM-DD HH:mm:ss'),
			end_date: dayjs(start_date).add(1, 'month').format('YYYY-MM-DD HH:mm:ss')
		})
		if (!success) return onFail(debug)
		return {
			props: {
				record_list: data
			}
		}
	}
</script>

<script>
	import SelectionBox from '$lib/ui-elements/selection-box.svelte'
	import CopyMessageTextBox from '$lib/option/copy-message-textbox.svelte'
	import {goto} from "$app/navigation";
	import {page} from "$app/stores";
	import {getContext} from 'svelte'
	const {openModal, closeModal} = getContext('simple-modal')

	export let record_list
	console.log('record_list', record_list)
	$: year = $page.params.yyyy
	$: month = $page.params.mm

	const onMonthChange = e => {
		let month = String(e.detail).padStart(2, "0")
		goto(`${$page.params.yyyy}-${month}`)
	}

	const onYearChange = e => {
		goto(`${e.detail}-${$page.params.mm}`)
	}
</script>

<p></p>

<div class="grid grid-cols-2 gap-4 p-4 max-w-screen-md">
	<div>
		<p class="text-sm text-gray-500">Month</p>
		<SelectionBox on:input={onMonthChange} options={['01','02','03','04','05','06','07','08','09','10','11','12']} selected_value={month} simple_array/>
	</div>
	<div>
		<p class="text-sm text-gray-500">Year</p>
		<SelectionBox on:input={onYearChange} options={[2021, 2022, 2023, 2024, 2025]} selected_value={year} simple_array/>
	</div>
</div>

<tr class="sticky top-0 bg-white">
	<th class="text-left">Voucher No</th>
	<th>Date</th>
	<th>Parent</th>
	<th>Students</th>
	<th>Teacher</th>
	<th>Title</th>
	<th>Lesson Duration</th>
	<th>Lesson count</th>
	<th>Lesson fee</th>
	<th>App fee</th>
	<th>Total fee</th>
	<th>Detail</th>
</tr>
{#if record_list.length}
	{#each record_list as r}
		<tr>
			<td class="text-left">{r.voucher_number}</td>
			<td>{dayjs(r.v_date).format('DD MMM YYYY (ddd)')}</td>
			<td>{r.payer_nickname}</td>
			<td>
				{#if r.student_nickname}
					<a class="text-blue-500" href="/students/{r.student_id}">
						{r.student_nickname}
					</a>
				{/if}
			</td>
			<td>
				{#if r.teacher_nickname}
					{r.teacher_nickname}
				{/if}
			</td>
			<td>
				{#if r.v_type === 'ONEONONE'}
					{r.course_type}
				{:else}
					{r.v_type}
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
			<td>${r.app_fee + r.lesson_fee}</td>
			<td>
				{#if r.confirm_summary}
					<button on:click={() => {openModal(CopyMessageTextBox, {msg: r.confirm_summary}, {padding: '1em'})}} class="button-secondary">Detail</button>
				{/if}
			</td>
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