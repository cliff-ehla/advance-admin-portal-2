<script>
	export let segment
	import {page} from '$app/stores'
	$: status = $page.query.get('status')

	let items = [
		{
			label: 'Trial Options',
			href: '/booking/trial-option?status=not-confirm',
			segment: 'trial-option',
			status: 'not-confirm'
		},
		{
			label: 'Confirmed Trial Options',
			href: '/booking/trial-option?status=confirm',
			segment: 'trial-option',
			status: 'confirm'
		},
		{
			label: 'Ready Trial Options',
			href: '/booking/trial-option?status=ready',
			segment: 'trial-option',
			status: 'ready'
		},
		{
			label: 'Trial lessons',
			href: '/booking/trial-lesson',
			segment: 'trial-lesson',
		},
		{
			label: 'Reservations',
			href: '/booking/reservation',
			segment: 'reservation',
		}
	]
</script>

<div class="flex px-4 pt-2 items-center bg-blue-100 border-b border-gray-400">
	<div class="inline-flex items-center border-r border-gray-400">
		{#each items as item}
			<a href={item.href} class="{(segment === item.segment && (item.status ? item.status === status : true)) ? '' : 'bg-opacity-50'} hover:bg-opacity-80 cursor-pointer bg-white h-10 px-8 flex items-center justify-center border-l border-t border-gray-400 bg-white relative"
			     style="top: 1px">{item.label}</a>
		{/each}
	</div>
</div>

<slot/>