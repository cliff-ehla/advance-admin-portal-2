<script context="module">
	import {http, onFail} from "$lib/http";
	import dayjs from "dayjs";

	export const load = async ({page, fetch}) => {
		if (page.query.get('reload')) {}
		let start_date = dayjs().subtract(7, 'day').format('YYYY-MM-DD HH:mm:ss')
		let end_date = dayjs().format('YYYY-MM-DD HH:mm:ss')
		const {data, success, debug} = await http.post(fetch, '/voucherApi/list_voucher', {
			start_date,
			end_date
		})
		if (!success) return onFail(debug)
		data.sort((a,b) => {
			return a.start_date > b.start_date ? 1 : -1
		})
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
	<h1 class="text-xl mb-4">最近7日記錄</h1>
	<VoucherTable {voucher_list}/>
</div>
