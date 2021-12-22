<script context="module">
	import {http, onFail} from "$lib/http";
	import dayjs from "dayjs";

	export const load = async ({page, fetch}) => {
		let start_date = dayjs().subtract(6, 'month').format('YYYY-MM-DD HH:mm:ss')
		let end_date = dayjs().add(1, 'day').format('YYYY-MM-DD HH:mm:ss')
		const {data, success, debug} = await http.post(fetch, '/voucherApi/list_voucher', {
			start_date,
			end_date
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
	export let voucher_list
	import VoucherTable from '$lib/voucher/voucher-table.svelte'
</script>

<div class="p-4">
	<h1 class="text-xl mb-4">最近記錄</h1>
	<VoucherTable {voucher_list}/>
</div>
