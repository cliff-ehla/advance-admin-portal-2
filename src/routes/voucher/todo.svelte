<script context="module">
	import {http, onFail} from "$lib/http";

	export const load = async ({fetch}) => {
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
	import Icon from '$lib/ui-elements/icon.svelte'
	import CreateVoucher from "$lib/voucher/create-voucher.svelte";
	import Dropdown from '$lib/ui-elements/dropdown3.svelte'
	import {getContext} from 'svelte'
	import dayjs from "dayjs";
	import utc from "dayjs/plugin/utc.js";
	import VoucherTable from '$lib/voucher/voucher-table.svelte'
	dayjs.extend(utc)

	const {openModal, closeModal} = getContext('simple-modal')

	export let voucher_list
	const type_option = ['TICKET', 'COURSE', 'TRIAL']

	const onCreateVoucher = (option) => {
		openModal(CreateVoucher, {
			voucher_type: option,
			onSuccess: refresh
		})
	}

	const refresh = async () => {
		const {data, success, debug} = await http.post(fetch, '/voucherApi/list_pending_voucher')
		voucher_list = data
	}
</script>

<div class="p-4">
	<h1 class="text-xl mb-4">待完成Voucher</h1>
	<VoucherTable {voucher_list}/>
</div>

<Dropdown activator_active_style="bg-blue-700" offset="8" placement="top-end"
          activator_style="fixed right-4 bottom-4 w-12 h-12 rounded-full flex items-center justify-center text-white bg-blue-500">
	<button slot="activator">
		<Icon name="add"/>
	</button>
	<div class="dropdown">
		{#each type_option as option}
			<div on:click={() => {onCreateVoucher(option)}} class="item">
				<img src="/{option.toLowerCase()}.png" alt="img" class="w-6">
				<p class="ml-1">{option}</p>
			</div>
		{/each}
	</div>
</Dropdown>
