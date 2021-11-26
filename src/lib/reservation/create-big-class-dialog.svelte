<script>
	import {onMount} from 'svelte'
	import {course_lesson_tbc_selection} from "../../store/calendar-action-status-store";
	import dayjs from "dayjs";
	import {tutor_store} from "../../store/tutor-store";
	import MaterialSelectionList from '$lib/material/material-selection-list.svelte'
	import SelectionBox from '$lib/ui-elements/selection-box.svelte'
	let slot = $course_lesson_tbc_selection.length ? $course_lesson_tbc_selection[0] : {}
	let selected_item_id
	import {http} from "../../helpers/http";

	let code_list = null
	let selected_code_id
	let selected_level
	let selected_classroom_size
	$: selected_code = code_list ? code_list.find(c => c.code_id === selected_code_id) : null
	$: level_list = selected_code ? selected_code.course_levels : null
	let classroom_size_list = [4,20,9999]

	onMount(async () => {
		const {data} = await http.get('courseApi/list_all_course_description_code')
		code_list = data
		console.log(code_list)
	})
</script>

<div class="max-w-screen-md w-full">
	<h2 class="font-bold text-lg mb-4">Create big/small lesson</h2>
	<p class="text-blue-500 font-bold text-xl">Tutor: {tutor_store.getTutorName(slot.teacher_id) || 'noname'}</p>
	<p>{dayjs(slot.start_date).format('MMM DD (ddd)@ h:mma')} - {dayjs(slot.end_date).format('h:mma')}</p>

	<label class="text-gray-500 text-sm mb-1 mt-4 block">Select a course type</label>
	{#if code_list}
		<SelectionBox options={code_list}
		              placeholder="Course type"
		              selected_value={selected_code_id}
		              on:input={e => {selected_code_id = e.detail}}
		              label_key="sub_cat_hk"
		              label_key_2="lang_type"
		              subtitle_key="description_hk"
		              value_key="code_id"/>
	{/if}

	<label class="text-gray-500 text-sm mb-1 mt-4 block">Select a level</label>
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

	<label class="text-gray-500 text-sm mb-1 mt-4 block">Classroom size</label>
	<SelectionBox options={classroom_size_list}
	              placeholder="Classroom size"
	              selected_value={selected_classroom_size}
	              on:input={e => {selected_classroom_size = e.detail}}
	              simple_array/>

	<MaterialSelectionList on:input={e => selected_item_id = e.detail.item_id}/>
</div>