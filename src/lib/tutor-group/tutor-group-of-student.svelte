<script>
	export let student_id

	import {getTutorGroupByChildId} from "../../api/zoom-api";
	import {student_store} from "../../store/student-store.js";
	import dayjs from "dayjs";
	import utc from "dayjs/plugin/utc.js";
	import Icon from '../../lib/ui-elements/icon.svelte'
	import {getContext} from 'svelte'
	import EditZoomCategoryDialog from './edit-zoom-category-dialog.svelte'
	dayjs.extend(utc)
	const {openModal} = getContext('simple-modal')

	let tutor_group_list

	$: {
		if (student_id) getData()
	}

	const getData = async () => {
		tutor_group_list = await getTutorGroupByChildId({child_id: student_id})
	}

	const onEdit = (z) => {
		openModal(EditZoomCategoryDialog, {
			category_type: z.category_type,
			category_level: z.category_level,
			wrapper_id: z.wrapper_id,
			onSuccess: getData
		})
	}
</script>

{#if !tutor_group_list}
	<p class="p-4">loading...</p>
{:else if tutor_group_list.length === 0}
	<p class="p-4">this student has no tutor group</p>
{:else}
	{#each tutor_group_list as tg}
		<div class="m-2 rounded border border-gray-300">
			<div class="p-4 bg-gray-100">
				<p class="font-bold">{tg.title}</p>
				<p>Student: {student_store.getStudentName(student_id)}</p>
				<p class="text-gray-400 text-xs">Tutor Group ID: {tg.tutor_group_id}</p>
				<p class="text-gray-400 text-xs">Is renewal: {tg.is_renewal}</p>
			</div>
			<div class="p-4">
				{#each tg.zooms as z}
					<div class="py-2 border-b border-gray-200 flex relative items-center" class:opacity-100={dayjs(z.start_date).isBefore(dayjs())}>
						<div class="w-20 flex items-center flex-shrink-0">
							{#if z.is_cancel}
								<Icon name="close" className="text-red-500 w-4"/>

								{#if z.s_sick_leave}
									<svg viewBox="0 0 36 36" class="ml-1 w-4 fill-current" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" clip-rule="evenodd" d="M20.9237 4.63869C19.6243 2.45377 16.3756 2.45377 15.0762 4.63869L0.457345 29.219C-0.842107 31.4039 0.782207 34.1351 3.38111 34.1351H32.6188C35.2177 34.1351 36.842 31.4039 35.5426 29.219L20.9237 4.63869ZM19.7169 25.185C20.0827 25.471 20.2656 25.87 20.2656 26.3822C20.2656 26.8344 20.096 27.187 19.7568 27.4397C19.4242 27.6858 18.9686 27.8088 18.3899 27.8088C17.4854 27.8088 16.8302 27.6259 16.4245 27.2601C16.0255 26.8877 15.8259 26.3123 15.8259 25.5341H12.3141C12.3141 26.4919 12.5535 27.3399 13.0324 28.0782C13.518 28.8098 14.2363 29.3885 15.1874 29.8142C16.1452 30.2332 17.2127 30.4427 18.3899 30.4427C20.0594 30.4427 21.373 30.0802 22.3308 29.3552C23.2885 28.6303 23.7674 27.6326 23.7674 26.3622C23.7674 24.7726 22.9826 23.5255 21.4129 22.6209C20.7677 22.2485 19.943 21.9026 18.9387 21.5834C17.9343 21.2574 17.2326 20.9448 16.8336 20.6455C16.4345 20.3396 16.235 20.0004 16.235 19.6279C16.235 19.2022 16.4146 18.8531 16.7737 18.5804C17.1395 18.301 17.635 18.1613 18.2602 18.1613C18.8788 18.1613 19.3677 18.3243 19.7268 18.6502C20.0926 18.9761 20.2756 19.435 20.2756 20.027H23.7674C23.7674 19.1424 23.5379 18.3575 23.079 17.6725C22.6201 16.9807 21.9749 16.4487 21.1435 16.0762C20.3188 15.7037 19.3843 15.5175 18.3401 15.5175C17.2692 15.5175 16.3048 15.6904 15.4468 16.0363C14.5888 16.3755 13.9237 16.8544 13.4515 17.4729C12.9859 18.0848 12.7531 18.7932 12.7531 19.598C12.7531 21.2142 13.6942 22.4846 15.5765 23.4091C16.1552 23.6951 16.9001 23.9911 17.8113 24.297C18.7225 24.603 19.3577 24.899 19.7169 25.185Z"/></svg>
								{:else if z.t_sick_leave}
									<svg viewBox="0 0 36 36" class="ml-1 w-4 fill-current" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" clip-rule="evenodd" d="M20.9237 4.63869C19.6243 2.45377 16.3756 2.45377 15.0762 4.63869L0.457345 29.219C-0.842107 31.4039 0.782207 34.1351 3.38111 34.1351H32.6188C35.2177 34.1351 36.842 31.4039 35.5426 29.219L20.9237 4.63869ZM19.8163 18.4207H24.1761V15.7171H12.0344V18.4207H16.3145V30.2432H19.8163V18.4207Z"/></svg>
								{/if}
							{:else if dayjs(z.start_date).isBefore(dayjs())}
								<Icon name="tick" className="text-green-500 w-4"/>
							{/if}
						</div>
						<div class="w-44 flex-shrink-0">{dayjs.utc(z.start_date).local().format('DD MMM YYYY (ddd)')}</div>
						<div class="w-28 flex-shrink-0">{dayjs.utc(z.start_date).local().format('hh:mm a')}</div>
						<div class="w-28 flex-shrink-0">{dayjs.utc(z.start_date).local().add(z.duration, 'minute').format('hh:mm a')}</div>
						<div class="w-28 flex-shrink-0">{z.teacher_nickname}</div>
						<div class="">
							<div class="w-full flex bg-gray-100 rounded-full px-4 py-1 text-sm leading-none text-left">
								<div>
									<p class="whitespace-nowrap">{z.category_type || 'no cat'}</p>
									<p class="whitespace-nowrap">{z.category_level || 'no lv'}</p>
								</div>
								<button class="bg-white rounded-full px-2 text-sm ml-2" on:click={() => onEdit(z)}>Edit</button>
							</div>
						</div>
						<div class="w-full ml-4">
							{#each z.days as d, i}
								<div class="flex items-center" class:mt-1={i > 0}>
									<div class="flex-1 flex items-center">
										<p>{d.title}</p>
										{#if d.t_difficulty_rate}
											<div class="flex-shrink-0 ml-2 w-4 h-4 rounded-full bg-green-500 text-white font-bold text-xs flex items-center justify-center">
												{d.t_difficulty_rate}
											</div>
										{/if}
									</div>
								</div>
							{/each}
						</div>
					</div>
				{/each}
			</div>
		</div>
	{/each}
{/if}