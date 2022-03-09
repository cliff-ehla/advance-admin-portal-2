<script>
	import MaterialSelectionList from './material-selection-list.svelte'
	import {getContext} from 'svelte'
	const {closeModal} = getContext('simple-modal')
	import {http} from "$lib/http.js";
	import Button from '$lib/ui-elements/button.svelte'
	import {triggerReload} from "$lib/helper/trigger-reload.js";

	export let syllabus_id
	let selected_item_id

	const onSave = async () => {
		console.log('cliff: ', selected_item_id)
		await http.post(fetch, '/syllabusApi/add_syllabus_item', {
			syllabus_id,
			item_id: selected_item_id
		})
		triggerReload()
		closeModal()
	}

	const onInput = (e) => {
		let {item_id, title} = e.detail
		selected_item_id = item_id
	}
</script>

<h2 class="mb-4 font-bold text-xl">Link material to syllabus</h2>

<MaterialSelectionList on:input={onInput} max_height="calc(100vh - 300px)"/>

<div class="px-8 flex justify-between items-center mt-4">
	<button on:click={closeModal} class="rounded border border-gray-300 px-12 flex items-center h-8">Cancel</button>
	<Button on:click={onSave} disabled={!selected_item_id}>
		Save
	</Button>
</div>