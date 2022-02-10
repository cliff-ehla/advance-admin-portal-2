<script>
	import {onMount, getContext} from 'svelte'
	import {action_status, course_lesson_tbc_selection, calendar_store} from "../../store/calendar-action-status-store";
	import dayjs from "dayjs";
	import {tutor_store} from "../../store/tutor-store";
	import MaterialSelectionList from '$lib/material/material-selection-list.svelte'
	import SelectionBox from '$lib/ui-elements/selection-box.svelte'
	import Button from '$lib/ui-elements/button.svelte'
	let slot = $course_lesson_tbc_selection.length ? $course_lesson_tbc_selection[0] : {}
	import {http} from "$lib/http.js";
	import {category_list} from "$lib/store/category-list";
	const {closeModal} = getContext('simple-modal')

	export let onSuccess = () => {}
	export let teacher_id
	export let tutor_course_id = undefined
	export let selected_item_id = undefined
	export let selected_classroom_size = undefined // size
	export let ticket = undefined // price

	let selected_category
	let classroom_list = []
	let material_list
	let classroom_size_list = [4,20,9999]
	$: disabled = !(selected_classroom_size && selected_item_id && tutor_course_id && ticket)
  const ticket_options = [
	  {
			value: 49,
		  label: '$49 小學（大班）'
	  },
	  {
		  value: 98,
		  label: '$98 小學（4人班）'
	  },
	  {
		  value: 68,
		  label: '$68 中學（大班）'
	  },
	  {
		  value: 136,
		  label: '$136 中學 （4人班）'
	  }
  ]

	onMount(async () => {
		const res = await http.post(fetch, '/tutorCourseApi/list_tutor_course', {
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
			teacher_id: slot.teacher_id,
			start_date,
			duration,
			student_size: selected_classroom_size,
			ticket
		}, {
			notification: '起左'
		})

		let zoom_id = data.zoom_id // TODO, backend need to return this
		if (tutor_course_id && zoom_id) {
			await http.post(fetch, '/tutorCourseApi/bind_tutor_course_with_zoom', {
				tutor_course_id,
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
		tutor_course_id = e.detail
		const {data} = await http.post(fetch, '/tutorCourseApi/list_tutor_course_by_id', {
			tutor_course_id
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
		              selected_value={tutor_course_id}
		              value_key="tutor_course_id" label_key="title"/>
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