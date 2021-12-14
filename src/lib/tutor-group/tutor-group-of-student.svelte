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
						<div class="w-12 flex-shrink-0">
							{#if z.is_cancel|| z.t_sick_leave || z.s_sick_leave}
								<Icon name="close" className="text-red-500 w-4"/>
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