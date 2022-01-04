<script>
	import dayjs from "dayjs";
	import Dropdown from '../../lib/ui-elements/dropdown3.svelte'
	import {tutor_store} from "../../store/tutor-store";
	export let user_info

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
				image: tutor.profile_pic,
				href: `/tutor/${tutor.user_id}/${dayjs().format('YYYY-MM')}`
			})): []
		},
		{
			segment: 'booking',
			name: 'Booking',
			href: '/booking/option',
			children: [
				{
					label: 'Trial option',
					href: '/booking/option'
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
				},
				{
					label: 'Requested class',
					href: '/classroom/request'
				}
			]
		},
		{
			segment: 'students',
			name: 'Students',
			href: '/students',
			children: [
				{
					label: '總覽',
					href: '/dashboard'
				},
				{
					label: '大細班課學生',
					href: '/students/classroom'
				},
				{
					label: 'All students',
					href: '/students'
				}
			]
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
			href: '/voucher/dashboard',
			children: [
				{
					label: '總覽',
					href: '/voucher/dashboard'
				},
				{
					label: '待處理',
					href: '/voucher/todo'
				}
			]
		}
	]
</script>

<div class="bg-blue-900 h-12 flex items-center text-white sticky top-0 z-30">
	<a href="/dashboard" class="w-40 ml-4">EHLA</a>
	<div class="flex-1 items-center flex justify-center">
		{#each menu_items as item}
			{#if item.children}
				<Dropdown
								activator_style="px-2 mx-1 text-white {item.segment === segment ? 'bg-white bg-opacity-30' : ''}"
								activator_active_style="bg-white bg-opacity-30" placement="bottom" offset="0" delay={10} caveat_visible>
					<a slot="activator" class="h-12 inline-flex items-center relative" href={item.href}>
						{item.name}
					</a>
					<div class="bg-white shadow rounded text-gray-700 p-4 w-64">
						{#each item.children as c}
							<a href={c.href} class="block px-4 py-2 hover:bg-gray-200 hover:text-blue-500 flex items-center">
								{#if c.image}
									<img src={c.image} alt={c.label} class="w-8 h-8 rounded-full mr-2">
								{/if}
								{c.label}
							</a>
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
	<Dropdown activator_active_style="bg-black bg-opacity-30" placement="right">
		<div slot="activator" class="w-40 text-right px-4 py-2 overflow-ellipsis overflow-hidden whitespace-nowrap">{user_info.username}</div>
		<div class="bg-white shadow-lg rounded p-2 text-black min-w-xs">
			<a href="/logout" class="px-4 py-2 hover:bg-gray-200 hover:text-blue-500">Logout</a>
		</div>
	</Dropdown>
</div>