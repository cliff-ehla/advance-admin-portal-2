<script context="module">
	import {http, onFail} from "$lib/http";
	import dayjs from "dayjs";

	export const load = async ({page, fetch}) => {
		let start_date = `${page.params.yyyy}-${page.params.mm}-01 00:00:00`
		const {data, success, debug} = await http.post(fetch, '/courseApi/list_voucher', {
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
	import {goto} from "$app/navigation";
	import {page} from "$app/stores";

	export let record_list
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

<tr>
	<th class="text-left">Voucher No</th>
	<th>Date</th>
	<th>User</th>
	<th>Lesson fee</th>
	<th>App fee</th>
</tr>
{#if record_list.length}
	{#each record_list as r}
		<tr>
			<td class="text-left">{r.voucher_number}</td>
			<td>{dayjs(r.v_date).format('DD MMM YYYY')}</td>
			<td>{r.payer_nickname}</td>
			<td>{r.lesson_fee}</td>
			<td>{r.app_fee}</td>
		</tr>
	{/each}
{:else}
	<p class="p-4">no data</p>
{/if}

<style>
	td, th {
			@apply p-4 border-b border-gray-200;
	}
</style>