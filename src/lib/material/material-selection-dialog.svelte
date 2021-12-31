<script>
	import MaterialSelectionList from './material-selection-list.svelte'
	import {getContext} from 'svelte'
	const {closeModal} = getContext('simple-modal')
	import dayjs from "dayjs";
	import {http} from "$lib/http.js";
	import Button from '$lib/ui-elements/button.svelte'

	export let zoom
	export let category

	$: is_classroom = !!zoom.rc_type
	let selected_item_id
	let item_title

	const onSave = () => {
		if (is_classroom) {
			editMaterialForClassroom()
		} else {
			addMaterialForOneOnOne()
		}
	}

	const addMaterialForOneOnOne = async () => {
		let start_time = dayjs(zoom.start_time).subtract(1, 'day').format('YYYY-MM-DD HH:mm:ss')
		let data = await http.post(fetch, '/organizationApi/purchase_work_task', {
			item_ids: [selected_item_id],
			tutor_group_id: zoom.tutor_group_id,
			wrapper_id: zoom.zoom_id,
			start_time
		})
		closeModal()
		onSuccess()
	}

	const editMaterialForClassroom = async () => {
		const map = {
			SMALL: 4,
			BIG: 20,
			UNLIMITED: 9999
		}
		await http.post(fetch, '/courseApi/edit_course_material', {
			item_id: selected_item_id,
			wrapper_id: zoom.zoom_id,
			code_id: zoom.description_code_id,
			student_size: map[zoom.big_classroom_type],
			teacher_id: zoom.teacher_id,
			rc_level: zoom.rc_level,
			start_date: zoom.start_time,
			duration: zoom.duration
		}, {
			notification: '成功更改Material'
		})
		onSuccess()
		closeModal()
	}

	const onSuccess = () => {
		const event = new CustomEvent('refresh-calendar', {
			bubbles: true,
			cancelable: true
		})
		document.dispatchEvent(event)
	}

	const onInput = (e) => {
		let {item_id, title} = e.detail
		selected_item_id = item_id
		item_title = title
	}
</script>

<h2 class="mb-4 font-bold text-xl">Add material</h2>

<MaterialSelectionList on:input={onInput} {category} max_height="calc(100vh - 300px)"/>

<div class="px-8 flex justify-between items-center mt-4">
	<button on:click={closeModal} class="rounded border border-gray-300 px-12 flex items-center h-8">Cancel</button>
	<Button on:click={onSave} disabled={!selected_item_id}>
		Save
	</Button>
</div>