<script>
	import {onMount, getContext} from 'svelte'
	import {action_status, course_lesson_tbc_selection, calendar_store} from "../../store/calendar-action-status-store";
	import dayjs from "dayjs";
	import {tutor_store} from "../../store/tutor-store";
	import MaterialSelectionList from '$lib/material/material-selection-list.svelte'
	import SelectionBox from '$lib/ui-elements/selection-box.svelte'
	import Button from '$lib/ui-elements/button.svelte'
	let slot = $course_lesson_tbc_selection.length ? $course_lesson_tbc_selection[0] : {}
	let selected_item_id
	import {http} from "$lib/http.js";
	import {category_list} from "$lib/store/category-list";

	export let onSuccess = () => {}

	const {closeModal} = getContext('simple-modal')
	let code_list = null
	let selected_code_id
	let selected_level
	let selected_classroom_size
	let selected_category
	$: selected_code = code_list ? code_list.find(c => c.code_id === selected_code_id) : null
	$: level_list = selected_code ? selected_code.course_levels : null
	let classroom_size_list = [4,20,9999]
	$: disabled = !(selected_code_id && selected_level && selected_classroom_size && selected_item_id)

	onMount(async () => {
		const {data} = await http.get(fetch, '/courseApi/list_all_course_description_code')
		code_list = data
	})

	const onCreate = async () => {
		if (disabled) return
		let start_date = dayjs(slot.start_date).utc().format('YYYY-MM-DD HH:mm:ss')
		let duration = dayjs(slot.end_date).diff(slot.start_date, 'minute')
		await http.post(fetch, '/courseApi/reg_course', {
			item_id: selected_item_id,
			rc_level: selected_level,
			teacher_id: slot.teacher_id,
			start_date,
			code_id: selected_code_id,
			duration,
			student_size: selected_classroom_size
		}, {
			notification: '起左'
		})
		onSuccess()
		closeModal()
		setTimeout(() => {
			action_status.set('')
			calendar_store.clear()
			course_lesson_tbc_selection.set([])
		}, 100)
	}
</script>

<div class="max-w-screen-md w-full">
	<h2 class="font-bold text-lg mb-2">Create big/small lesson</h2>
	<p class="text-blue-500 font-bold text-xl">Tutor: {tutor_store.getTutorName(slot.teacher_id) || 'noname'}</p>
	<p class="border-b-2 border-black inline-block">{dayjs(slot.start_date).format('MMM DD (ddd)@ h:mma')} - {dayjs(slot.end_date).format('h:mma')} ({dayjs(slot.end_date).diff(slot.start_date, 'minute')}min)</p>

	<label class="text-gray-500 text-sm mb-1 mt-4 block">Select a course type</label>
	{#if code_list}
		<SelectionBox options={code_list}
		              placeholder="Course type"
		              selected_value={selected_code_id}
		              on:input={e => {selected_code_id = e.detail}}
		              label_key="sub_cat_hk"
		              subtitle_key="lang_type"
		              value_key="code_id"/>
	{/if}

	<label class="text-gray-500 text-sm mb-1 mt-2 block">Select a level</label>
	{#if level_list}
		<SelectionBox options={level_list}
		              placeholder="Select a level"
		              selected_value={selected_level}
		              on:input={e => {selected_level = e.detail}}
		              label_key="level_alter"
		              subtitle_key="level"
		              value_key="rc_level"/>
	{:else}
		<div class="py-2 px-4 border border-gray-300 text-gray-300 cursor-not-allowed">Please Select course first</div>
	{/if}

	<label class="text-gray-500 text-sm mb-1 mt-2 block">Classroom size</label>
	<SelectionBox options={classroom_size_list}
	              placeholder="Classroom size"
	              selected_value={selected_classroom_size}
	              on:input={e => {selected_classroom_size = e.detail}}
	              simple_array/>

	<label class="text-gray-500 text-sm mb-1 mt-2 block">Material category</label>
	<SelectionBox options={$category_list}
	              placeholder="Material category"
	              selected_value={selected_category}
	              on:input={e => {selected_category = e.detail}}
	              simple_array/>

	{#if selected_category}
		<MaterialSelectionList category={selected_category} max_height="500px" on:input={e => selected_item_id = e.detail.item_id}/>
	{/if}

	<div class="mt-4 flex justify-end">
		<Button disabled={disabled} on:click={onCreate}>Create</Button>
	</div>
</div>