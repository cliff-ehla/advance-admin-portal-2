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
	export let teacher_id

	const {closeModal} = getContext('simple-modal')
	let selected_code_id
	let selected_level
	let selected_classroom_size
	let selected_category
	let ticket
	let classroom_list = []
	let classroom_id
	let material_list
	let classroom_size_list = [4,20,9999]
	$: disabled = !(selected_code_id && selected_level && selected_classroom_size && selected_item_id)
  const ticket_options = [
	  {
			value: 49,
		  label: '小學（大班）'
	  },
	  {
		  value: 98,
		  label: '小學（4人班）'
	  },
	  {
		  value: 68,
		  label: '中學（大班）'
	  },
	  {
		  value: 136,
		  label: '中學 （4人班）'
	  }
  ]

	onMount(async () => {
		const res = await http.post(fetch, '/classroomApi/list_tutor_classroom', {
			teacher_id
		})
		classroom_list = res.data
	})

	const onCreate = async () => {
		if (disabled) return
		let start_date = dayjs(slot.start_date).utc().format('YYYY-MM-DD HH:mm:ss')
		let duration = dayjs(slot.end_date).diff(slot.start_date, 'minute')
		const {data} = await http.post(fetch, '/courseApi/reg_course', {
			item_id: selected_item_id,
			rc_level: selected_level,
			teacher_id: slot.teacher_id,
			start_date,
			code_id: selected_code_id,
			duration,
			student_size: selected_classroom_size,
			ticket
		}, {
			notification: '起左'
		})

		let zoom_id = data.zoom_id // TODO, backend need to return this
		if (classroom_id && zoom_id) {
			await http.post(fetch, '/classroomApi/bind_tutor_classroom_with_zoom', {
				classroom_id,
				zoom_id
			}, {
				notification: 'Bind 左classroom'
			})
		}
		onSuccess()
		closeModal()
		setTimeout(() => {
			action_status.set('')
			calendar_store.clear()
			course_lesson_tbc_selection.set([])
		}, 100)
	}

	const onClassroomSelected = async e => {
		classroom_id = e.detail
		const {data} = await http.post(fetch, '/classroomApi/list_tutor_classroom_by_id', {
			classroom_id
		})
		data.material_status.forEach(m => m.used_cnt = String(m.used_cnt))
		material_list = data.material_status
	}
</script>

<div class="max-w-screen-md w-full">
	<h2 class="font-bold text-lg mb-2">Create big/small lesson</h2>
	<p class="text-blue-500 font-bold text-xl">Tutor: {tutor_store.getTutorName(slot.teacher_id) || 'noname'}</p>
	<p class="border-b-2 border-black inline-block">{dayjs(slot.start_date).format('MMM DD (ddd)@ h:mma')} - {dayjs(slot.end_date).format('h:mma')} ({dayjs(slot.end_date).diff(slot.start_date, 'minute')}min)</p>
	<label class="text-gray-500 text-sm mb-1 mt-2 block">Classroom size</label>
	<SelectionBox options={classroom_size_list}
	              placeholder="Classroom size"
	              selected_value={selected_classroom_size}
	              on:input={e => {selected_classroom_size = e.detail}}
	              simple_array/>

	<label class="text-gray-500 text-sm mb-1 mt-2 block">Ticket</label>
	<SelectionBox options={ticket_options}
	              placeholder="Ticket price"
	              selected_value={ticket}
	              on:input={e => {ticket = e.detail}}/>

	{#if classroom_list}
		<label class="text-gray-500 text-sm mb-1 mt-2 block">Classroom</label>
		<SelectionBox options={classroom_list} on:input={onClassroomSelected}
		              selected_value={classroom_id}
		              value_key="classroom_id" label_key="title"/>
	{/if}

	{#if material_list}
		<div class="mt-4">
			<SelectionBox options={material_list} on:input={e => {selected_item_id = e.detail}}
			              selected_value={selected_item_id}
			              value_key="item_id" label_key="name" subtitle_prefix="Used count:" subtitle_key="used_cnt" image_key="thumbnail_path"/>
		</div>
	{/if}

<!--	<label class="text-gray-500 text-sm mb-1 mt-2 block">Material category</label>-->
<!--	<SelectionBox options={$category_list}-->
<!--	              placeholder="Material category"-->
<!--	              selected_value={selected_category}-->
<!--	              on:input={e => {selected_category = e.detail}}-->
<!--	              simple_array/>-->

<!--	{#if selected_category}-->
<!--		<MaterialSelectionList category={selected_category} max_height="500px" on:input={e => selected_item_id = e.detail.item_id}/>-->
<!--	{/if}-->

	<div class="mt-4 flex justify-end">
		<Button disabled={disabled} on:click={onCreate}>Create</Button>
	</div>
</div>