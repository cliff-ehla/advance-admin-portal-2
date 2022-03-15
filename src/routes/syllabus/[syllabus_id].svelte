<script context="module">
	import {http, onFail} from "$lib/http";

	export const load = async ({page, fetch}) => {
		if (page.query.get('reload')) {}
		const {data, success, debug} = await http.post(fetch, '/syllabusApi/list_syllabus_category_detail', {
			syllabus_id: page.params.syllabus_id
		})
		if (!success) return onFail(debug)
		return {
			props: {
				syllabus: data
			}
		}
	}
</script>

<script>
	import Icon from '$lib/ui-elements/icon.svelte'
	import {getContext} from 'svelte'
	import {page} from "$app/stores";
	const {openModal, closeModal} = getContext('simple-modal')
	import LinkMaterialToSyllabus from '$lib/material/link-material-to-syllabus.svelte'
	import {dialog} from "$lib/store/dialog.js";
	export let syllabus
	import {triggerReload} from "$lib/helper/trigger-reload.js";

	const onDelete = (item_id) => {
		dialog.confirm({
			message: 'Remove this item from syllabus',
			onConfirm: () => {
				http.post(fetch, '/syllabusApi/delete_syllabus_item', {
					syllabus_id: $page.params.syllabus_id,
					item_id
				}, {
					notification: 'Removed'
				})
			},
			onSuccess: triggerReload
		})
	}
	
	const onAddItem = () => {
		openModal(LinkMaterialToSyllabus, {
			syllabus_id: $page.params.syllabus_id
		})
	}
</script>

<div class="container py-4">
	<div class="grid grid-cols-3 gap-4">
		{#each syllabus as item}
			<div on:click={() => {open(`/item/${item.item_id}`,'Preview', "popup")}} class="cursor-pointer hover:border-blue-500 border-gray-100 border shadow rounded flex items-center relative group">
				<button on:click|stopPropagation={() => {onDelete(item.item_id)}} class="group-hover:opacity-100 opacity-0 absolute top-1 right-1 w-8 h-8 rounded-full hover:bg-gray-100 cc transition">
					<Icon name="trash" className="w-3 text-red-500"/>
				</button>
				<img src={item.thumbnail_path} class="w-20" alt={item.name}>
				<p class="px-4 py-2 leading-tight text-gray-600">{item.name}</p>
			</div>
		{/each}
	</div>
</div>

<div class="fixed right-2 bottom-2">
	<button on:click={onAddItem} class="button">
		Add item
	</button>
</div>