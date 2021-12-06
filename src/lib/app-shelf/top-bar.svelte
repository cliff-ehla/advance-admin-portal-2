<script>
	import dayjs from "dayjs";
	import Dropdown from '../../lib/ui-elements/dropdown3.svelte'
	import {user_store} from "../../store/user-store";
	import {tutor_store} from "../../store/tutor-store";

	$: first_teacher_id = $tutor_store && $tutor_store[0] && $tutor_store[0].user_id

	export let segment;

	$: date_string = dayjs().format('YYYY_MM_DD')

	$: menu_items = [
		{
			segment: 'tutor',
			name: 'Tutor',
			href: '/tutor',
			children: $tutor_store ? $tutor_store.map(tutor => ({
				label: tutor.nickname,
				href: `/tutor/${tutor.user_id}/${dayjs().format('YYYY-MM')}`
			})): []
		},
		{
			segment: 'booking',
			name: 'Booking',
			href: '/booking/trial-option?status=not-confirm',
			children: [
				{
					label: 'Trial option',
					href: '/booking/trial-option?status=not-confirm'
				},
				{
					label: 'Confirmed trial option',
					href: '/booking/trial-option?status=confirm'
				},
				{
					label: 'Ready trial option',
					href: '/booking/trial-option?status=ready'
				},
				{
					label: 'Trial lessons',
					href: '/booking/trial-lesson'
				},
				{
					label: 'Reservation',
					href: '/booking/reservation'
				}
			]
		},
		{
			segment: 'zoom',
			name: 'Calendar',
			href: `/zoom/${dayjs().format('YYYY-MM-DD')}`,
			children: [
				{
					label: 'Calendar',
					href: `/zoom/${dayjs().format('YYYY-MM-DD')}`
				},
				{
					label: 'Big class',
					href: '/zoom/big-class'
				}
			]
		},
		{
			segment: 'students',
			name: 'Students',
			href: '/students'
		},
		{
			segment: 'tutor-group',
			name: 'Tutor Group',
			href: '/tutor-group',
			children: [
				{
					label: 'Half',
					href: '/tutor-group'
				},
				{
					label: 'Need renew',
					href: '/tutor-group/renew'
				}
			]
		},
		{
			segment: 'voucher',
			name: 'Voucher',
			href: '/voucher'
		}
	]
</script>

<div class="bg-blue-900 h-12 flex items-center text-white">
	<a href="/" class="w-40 ml-4">EHLA</a>
	<div class="flex-1 items-center flex justify-center">
		{#each menu_items as item}
			{#if item.children}
				<Dropdown
								activator_style="px-2 mx-1 text-white {item.segment === segment ? 'bg-white bg-opacity-30' : ''}"
								activator_active_style="bg-white bg-opacity-30" placement="bottom" offset="0" delay={10} caveat_visible>
					<a slot="activator" class="h-12 inline-flex items-center relative" href={item.href}>
						{item.name}
						<!--{#if item.segment === segment}-->
						<!--	<span class="block absolute bottom-0 inset-x-0 h-1 bg-white"></span>-->
						<!--{/if}-->
					</a>
					<div class="bg-white shadow rounded text-gray-700 p-4 w-64">
						{#each item.children as c}
							<a href={c.href} class="block px-4 py-2 hover:bg-gray-200 hover:text-blue-500">{c.label}</a>
						{/each}
					</div>
				</Dropdown>
			{:else}
				<a class="px-4 h-12 inline-flex items-center relative {item.segment === segment ? 'bg-white bg-opacity-30' : ''}" href={item.href}>
					{item.name}
					{#if item.segment === segment}
						<span class="block absolute bottom-0 inset-x-0 h-1 bg-white"></span>
					{/if}
				</a>
			{/if}
		{/each}
	</div>
	{#if $user_store}
		<Dropdown activator_active_style="bg-black bg-opacity-30" placement="right">
			<div slot="activator" class="w-40 text-right px-4 py-2 overflow-ellipsis overflow-hidden whitespace-nowrap">{$user_store.username}</div>
			<div class="bg-white shadow-lg rounded p-2 text-black min-w-xs">
				<a href="/logout" class="px-4 py-2 hover:bg-gray-200 hover:text-blue-500">Logout</a>
			</div>
		</Dropdown>
	{:else}
		<a href="/login">Login</a>
	{/if}
</div>