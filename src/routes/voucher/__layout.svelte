<script>
	import dayjs from "dayjs";
	import {page} from "$app/stores";
	import Icon from '$lib/ui-elements/icon.svelte'
	import Dropdown from '$lib/ui-elements/dropdown3.svelte'
	import CreateVoucher from "$lib/voucher/create-voucher.svelte";
	import {triggerReload} from "$lib/helper/trigger-reload.js";
	import {getContext} from 'svelte'
	const {openModal, closeModal} = getContext('simple-modal')
	const items = [
		{
			label: '總覽',
			href: '/voucher/dashboard'
		},
		{
			label: '待完成',
			href: '/voucher/todo'
		},
		{
			label: '月份',
			href: `/voucher/${dayjs().format('YYYY-MM')}`
		}
	]

	const type_option = ['TICKET', 'COURSE', 'TRIAL']

	const onCreateVoucher = (option) => {
		openModal(CreateVoucher, {
			voucher_type: option,
			onSuccess: triggerReload
		})
	}
</script>

<div class="flex px-4 pt-2 items-center bg-blue-100 border-b border-gray-400">
	<div class="inline-flex items-center border-r border-gray-400">
		{#each items as item}
			<a href={item.href} class="{item.href === $page.path ? '' : 'bg-opacity-50'} hover:bg-opacity-80 cursor-pointer bg-white h-10 px-8 flex items-center justify-center border-l border-t border-gray-400 bg-white relative"
			   style="top: 1px">{item.label}</a>
		{/each}
	</div>
</div>

<slot/>

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