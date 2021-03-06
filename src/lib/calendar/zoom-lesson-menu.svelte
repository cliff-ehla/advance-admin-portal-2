<script>
	import Dropdown from '$lib/ui-elements/dropdown3.svelte'
	import Icon from '$lib/ui-elements/icon.svelte'
	import Datepicker from '$lib/ui-elements/date-picker/calendar.svelte'
	import CreateBigClassDialog from '$lib/classroom/create-big-class-dialog.svelte'
	import BatchCreateClassroom from '$lib/classroom/batch-create-classroom.svelte'
	export let zoom = {}
	export let selected = new Date()
	export let onEdit = () => {}
	export let onAddMaterial = () => {}
	export let onChangeDate = () => {}
	export let onRemoveMaterial = () => {}
	export let days = []
	import {listZoom} from "../../api/zoom-api";
	import dayjs from 'dayjs'
	import {listStudentNote} from "../../api/student-note-api";
	import {student_store} from "../../store/student-store";
	import {category_list} from "$lib/store/category-list";
	import {big_class_mapper} from "$lib/store/big-class-mapper.js";
	import {getContext} from 'svelte'
	const {openModal, closeModal} = getContext('simple-modal')
	import {tooltip} from "$lib/aciton/tooltip.js";

	const is_big_class = !!zoom.rc_type
	let material_history
	let student_notes
	$: student_id = zoom.students[0] && zoom.students[0].user_id

	const onRemoveClick = (day_id) => {
		let new_days = days.filter(d => d.day_id !== day_id)
		new_days = new_days.map(d => d.day_id)
		onRemoveMaterial({day_ids: new_days})
	}

	const onMaterialMenuOpen = async () => {
		if (material_history) return
		let zoom_list = await listZoom({
			tutor_group_id: zoom.tutor_group_id
		})
		const days = zoom_list.reduce((acc, zoom) => {
			zoom.days.forEach(d => {
				d.start_date = zoom.start_date
			})
			return [...zoom.days, ...acc]
		}, [])
		material_history = days
	}

	const onNoteDropdownOpen  = async () => {
		student_notes = await listStudentNote({
			student_id
		})
	}

	const onEditClassroom = () => {
		const big_classroom_type = zoom.big_classroom_type
		const _student_size = big_classroom_type === 'SMALL' ? 4 : big_classroom_type === 'BIG' ? 20 : 9999
		const _ticket = _student_size === 4 ? 98 : 49
		const payload = {
			teacher_id: zoom.teacher_id,
			tutor_course_id: zoom.tutor_course_id,
			selected_item_id: zoom.days[0].item_id,
			selected_classroom_size: zoom.student_size || _student_size,
			ticket: zoom.ticket || _ticket,
			zoom_id: zoom.zoom_id,
			start_time: zoom.start_time,
			duration: zoom.duration,
			is_always_open: zoom.is_always_open
		}
		openModal(CreateBigClassDialog, payload, {
			width: '400px',
			overflow: 'initial'
		})
	}

	const onAddBatchClassroom = () => {
		openModal(BatchCreateClassroom, {
			teacher_id: zoom.teacher_id,
			tutor_course_id: zoom.tutor_course_id
		}, {
			width: '800px'
		})
	}
</script>

<div class="shadow-lg border border-gray-300 rounded bg-white text-sm text-left" style="min-width: 200px">
	{#if is_big_class}
		<div class="px-4 pt-4">
			<p class="text-xs text-gray-400 text-center mb-1">ID:{zoom.tutor_group_id}</p>
			<div class="bg-blue-50 border-blue-500 border-2 px-4 py-1 text-center rounded-sm">
				<p class="font-bold">{zoom.description_code_short_id}</p>
				<p class="text-xs text-gray-500">{big_class_mapper.getCourseCategoryFullName(zoom.description_code_short_id)}</p>
				<p class="text-xs text-gray-500">Lv: {zoom.rc_level}</p>
			</div>
		</div>
	{:else}
		<div class="bg-blue-100 text-blue-500 font-bold text-xs p-2">
			<p class="mb-2">{zoom.title} ({zoom.tutor_group_id})</p>
			<div class="flex items-center">
				<Icon name="avatar" className="w-4 mr-2"/>
				<p>{zoom.students.map(s => s.nickname).join(',')}</p>
			</div>
		</div>
	{/if}

	<div class="p-2">
		<button on:click={onEdit} class="text-left block w-full px-2 py-2 hover:text-blue-500 hover:bg-gray-100 mb-2">Edit status</button>
		{#if !is_big_class}
			<Dropdown caveat_visible placement="right" activator_active_style="bg-gray-100 text-blue-500" activator_style="text-left block  px-2 py-2 mb-2">
				<button slot="activator">Add zoom to tutor group</button>
				<Datepicker {selected} on:datechange={e => {onChangeDate(e, 'add_zoom_to_tutor_group')}}/>
			</Dropdown>
		{/if}
		<Dropdown caveat_visible placement="right" activator_active_style="bg-gray-100 text-blue-500" activator_style="text-left block  px-2 py-2 mb-2">
			<button slot="activator">Change Date</button>
			<Datepicker {selected} on:datechange={e => {onChangeDate(e, 'edit_time')}}/>
		</Dropdown>
		{#if student_id && !is_big_class}
			<Dropdown on:show={onNoteDropdownOpen} caveat_visible placement="right" activator_active_style="bg-gray-100 text-blue-500" activator_style="text-left block  px-2 py-2 mb-2">
				<button slot="activator">Reminder</button>
				<div class="shadow-lg bg-white border border-gray-300 p-2 pb-12">
					{#if student_notes}
						{#if student_notes.length}
							<div class="max-h-80 overflow-y-scroll">
								{#each student_notes as note}
									<div class="p-2">
										<div class="text-xs text-gray-500">{dayjs(note.update_ts).format('DD MMM YYYY')}</div>
										<div>{note.note}</div>
									</div>
								{/each}
							</div>
						{:else}
							<div class="p-2">No note</div>
						{/if}
						<a class="block mt-2 text-blue-500 hover:text-blue-700 p-2 bg-gray-100 rounded m-1" href="/students/{student_id}/note">Create note</a>
					{:else}
						loading...
					{/if}
				</div>
			</Dropdown>
		{/if}
		{#if is_big_class}
			<div on:click={() => {open(`/item/${zoom.days[0].item_id}`,'Preview', "popup")}} class="item max-w-sm">
				{zoom.days[0].title} <button class="button-secondary ml-2">Preview</button>
			</div>
			<button on:click={onEditClassroom} class="item">
				修改大課堂
				{#if !zoom.tutor_course_id}
					<div use:tooltip={'請加番入個課程入面'} class="ml-2 bg-red-500 text-white text-xs rounded px-1">補番入課程</div>
				{/if}
			</button>
			<button on:click={onAddBatchClassroom} class="item">
				建立更多課堂
			</button>
		{:else}
			<Dropdown caveat_visible placement="right" activator_active_style="bg-gray-100 text-blue-500" activator_style="text-left block  px-2 py-2 mb-2">
				<button slot="activator">Material(s)</button>
				<div class="shadow-lg bg-white border border-gray-300 p-2">
					<div>
						{#each days as d}
							<div class="flex items-center">
								<div on:click={() => {open(`/item/${d.item_id}`,'Preview', "popup")}} class="text-left block px-2 py-2 hover:text-blue-500 hover:bg-gray-100 mb-2 cursor-pointer">{d.title}</div>
								<div on:click={() => {onRemoveClick(d.day_id)}} class="cursor-pointer w-10 h-10 flex justify-center items-center hover:bg-gray-100 hover:text-blue-500">
									<Icon name="trash" className="w-4"/>
								</div>
							</div>
						{/each}
						<Dropdown on:show={onMaterialMenuOpen} caveat_visible placement="right" activator_active_style="bg-gray-100 text-blue-500" activator_style="text-left block  px-2 py-2 mb-2">
							<button slot="activator">Add Material</button>
							<div class="shadow-lg bg-white border border-gray-300 p-2 flex">
								<div class="w-56">
									{#each $category_list as item}
										<button on:click={() => onAddMaterial(item)} class="text-left block px-2 py-2 hover:text-blue-500 hover:bg-gray-100 w-64">{item}</button>
									{/each}
								</div>
								<div class="w-56 border-gray-300 border-l">
									{#if !material_history}
										loading history...
									{:else}
										{#each material_history as day}
											<div class="flex text-sm leading-none py-2 items-center border-b border-gray-200">
												<div class="flex-shrink-0 text-xs text-center w-8 h-8 bg-gray-100 mr-4">{dayjs(day.start_date).format('DD MMM')}</div>
												<div class="flex-1">{day.title}</div>
												{#if day.t_difficulty_rate}
													<div class="flex-shrink-0 w-4 h-4 rounded-full bg-blue-500 text-white font-bold flex items-center justify-center">{day.t_difficulty_rate}</div>
												{/if}
											</div>
										{/each}
									{/if}
								</div>
							</div>
						</Dropdown>
					</div>
				</div>
			</Dropdown>
		{/if}
		<Dropdown caveat_visible placement="right" activator_active_style="bg-gray-100 text-blue-500" activator_style="text-left block  px-2 py-2 mb-2">
			<button slot="activator">Students</button>
			<div class="shadow-lg bg-white border border-gray-300 p-2 flex">
				<div class="w-56">
					{#if zoom.students.length}
						{#each zoom.students as s}
							<a href="/students/{s.user_id}" class="hover:text-blue-500 block p-2">{s.nickname} ({student_store.getStudentLevel(s.user_id)})</a>
						{/each}
					{:else}
						<p>no students</p>
					{/if}
<!--					<div class="mt-4">-->
<!--						<button>Add student to waiting list</button>-->
<!--					</div>-->
				</div>
			</div>
		</Dropdown>
	</div>
</div>
