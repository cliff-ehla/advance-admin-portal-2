<script>
	import dayjs from "dayjs";
	import {page} from "$app/stores";

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