<script>
	import {onMount} from 'svelte'
	import {http} from "../helpers/http";
	import dayjs from "dayjs";
	import SelectionBox from '$lib/ui-elements/selection-box.svelte'

	let record_list
	let loading
	let year = dayjs().format('YYYY')
	let month = dayjs().format('MM')

	onMount(async () => {
		await fetchData()
	})

	$: {
		if (year || month) {
			fetchData()
		}
	}

	const fetchData = async () => {
		loading = true
		let start_date = `${year}-${month}-01 00:00:00`
		let {data} = await http.post('courseApi/list_voucher', {
			start_date: dayjs(start_date).format('YYYY-MM-DD HH:mm:ss'),
			end_date: dayjs(start_date).add(1, 'month').format('YYYY-MM-DD HH:mm:ss')
		})
		loading = false
		record_list = data
	}
</script>

<div class="grid grid-cols-2 gap-4 p-4">
	<SelectionBox on:input={e => {month = e.detail}} options={[1,2,3,4,5,6,7,8,10,11,12]} selected_value={month} simple_array/>
	<SelectionBox on:input={e => {year = e.detail}} options={[2021, 2022, 2023, 2024, 2025]} selected_value={year} simple_array/>
</div>

{#if record_list}
	{#if record_list.length}
		<tr>
			<th class="p-4">User</th>
			<th class="p-4">Voucher No</th>
			<th class="p-4">Date</th>
			<th class="p-4">Lesson fee</th>
			<th class="p-4">App fee</th>
		</tr>
		{#each record_list as r}
			<tr class="p-4">
				<td class="p-4">{r.payer_nickname}</td>
				<td class="p-4">{r.voucher_number}</td>
				<td class="p-4">{r.v_date}</td>
				<td class="p-4">{r.lesson_fee}</td>
				<td class="p-4">{r.app_fee}</td>
			</tr>
		{/each}
	{:else}
		<p>no data</p>
	{/if}
{:else}
	loading
{/if}