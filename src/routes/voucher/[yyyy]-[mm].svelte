<script context="module">
	import {http, onFail} from "$lib/http";
	import dayjs from "dayjs";

	export const load = async ({page, fetch}) => {
		if (page.query.get('reload')) {}
		let start_date = `${page.params.yyyy}-${page.params.mm}-01 00:00:00`
		const {data, success, debug} = await http.post(fetch, '/voucherApi/list_voucher', {
			start_date: dayjs(start_date).format('YYYY-MM-DD HH:mm:ss'),
			end_date: dayjs(start_date).add(1, 'month').format('YYYY-MM-DD HH:mm:ss')
		})
		if (!success) return onFail(debug)
		return {
			props: {
				voucher_list: data
			}
		}
	}
</script>

<script>
	import SelectionBox from '$lib/ui-elements/selection-box.svelte'
	import {goto} from "$app/navigation";
	import {page} from "$app/stores";
	import {getContext} from 'svelte'
	const {openModal, closeModal} = getContext('simple-modal')
	import VoucherTable from '$lib/voucher/voucher-table.svelte'

	export let voucher_list
	$: year = $page.params.yyyy
	$: month = $page.params.mm
	let total = {
		alipay: 0,
		bank_transfer: 0,
		payme: 0,
		all: 0
	}

	$: {
		voucher_list.forEach(v => {
			if (v.payment_method) {
				if (!v.is_invalid) {
					const _payment_method = v.payment_method.toLowerCase().replace(' ', '_')
					const total_fee = (Number(v.app_fee) + Number(v.lesson_fee))
					total[_payment_method] += total_fee
					total.all += total_fee
				}
			}
		})
	}

	const onMonthChange = e => {
		let month = String(e.detail).padStart(2, "0")
		goto(`${$page.params.yyyy}-${month}`)
	}

	const onYearChange = e => {
		goto(`${e.detail}-${$page.params.mm}`)
	}
</script>

<div class="flex items-center p-4">
	<div>
		<p class="text-sm text-gray-500">Month</p>
		<SelectionBox on:input={onMonthChange} options={['01','02','03','04','05','06','07','08','09','10','11','12']} selected_value={month} simple_array/>
	</div>
	<div class="ml-2">
		<p class="text-sm text-gray-500">Year</p>
		<SelectionBox on:input={onYearChange} options={[2021, 2022, 2023, 2024, 2025]} selected_value={year} simple_array/>
	</div>
	<div class="ml-auto flex items-center bg-gray-50 border border-gray-300 rounded">
		<div class="ml-4">
			<p class="text-sm text-gray-500">Alipay</p>
			<p>${total.alipay}</p>
		</div>
		<div class="ml-4">
			<p class="text-sm text-gray-500">Bank transfer</p>
			<p>${total.bank_transfer}</p>
		</div>
		<div class="ml-4">
			<p class="text-sm text-gray-500">PayMe</p>
			<p>${total.payme}</p>
		</div>
		<div class="p-4 ml-4 font-bold border-l border-gray-300">
			<p class="text-sm text-gray-500">Total</p>
			<p>${total.all}</p>
		</div>
	</div>
</div>

<div class="p-4">
	<VoucherTable {voucher_list}/>
</div>