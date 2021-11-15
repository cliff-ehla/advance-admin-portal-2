<script>
	import MaterialSelectionList from './material-selection-list.svelte'
	import {addMaterialToZoom} from "../../store/org-api";
	import {getContext} from 'svelte'
	const {closeModal} = getContext('simple-modal')
	import dayjs from "dayjs";

	export let zoom
	export let category
	export let onAddMaterialSuccess = () => {}

	let selected_item_id
	let loading_save
	let item_title

	const onSave = async () => {
		let start_time = dayjs(zoom.start_time).subtract(1, 'day').format('YYYY-MM-DD HH:mm:ss')
		let payload = {
			item_id: selected_item_id,
			tutor_group_id: zoom.tutor_group_id,
			wrapper_id: zoom.zoom_id,
			start_time,
			type_key: "reading-pdf"
		}
		loading_save = true
		let data = await addMaterialToZoom(payload)
		let day_id = data.day_id
		loading_save = false
		closeModal()
		onAddMaterialSuccess({
			item_title,
			day_id,
			item_id: selected_item_id
		})
	}

	const onInput = (e) => {
		let {item_id, title} = e.detail
		selected_item_id = item_id
		item_title = title
	}
</script>

<MaterialSelectionList on:input={onInput} {category} max_height="calc(100vh - 300px)"/>

<div class="h-16 px-8 flex border-t border-gray-300 justify-between items-center">
	<button on:click={closeModal} class="rounded border border-gray-300 px-12 flex items-center h-8">Cancel</button>
	<button on:click={onSave} class="rounded {(loading_save || !selected_item_id) ? 'bg-gray-300 text-gray-400' : 'bg-blue-500 text-white'} px-12 flex items-center h-8">{loading_save ? 'Saving...' : 'Save'}</button>
</div>