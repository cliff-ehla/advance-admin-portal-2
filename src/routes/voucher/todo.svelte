<script context="module">
	import {http, onFail} from "$lib/http";

	export const load = async ({fetch, page}) => {
		if (page.query.get('reload')) {}
		const {data, success, debug} = await http.post(fetch, '/voucherApi/list_pending_voucher')
		if (!success) return onFail(debug)
		return {
			props: {
				voucher_list: data
			}
		}
	}
</script>

<script>
	import VoucherTable from '$lib/voucher/voucher-table.svelte'
	export let voucher_list
</script>

<div class="p-4">
	<h1 class="text-xl mb-4">待完成Voucher</h1>
	<VoucherTable {voucher_list}/>
</div>


