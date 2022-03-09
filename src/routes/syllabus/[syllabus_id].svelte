<script context="module">
	import {http, onFail} from "$lib/http";

	export const load = async ({page, fetch}) => {
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
	export let syllabus
	console.log('cliff: ', syllabus)
	
	const onDelete = (id) => {
		console.log('cliff: ', id)
	}
</script>

<div class="container py-4">
	<div class="grid grid-cols-3 gap-4">
		{#each syllabus as item}
			<div class="cursor-pointer hover:border-blue-500 border-gray-100 border shadow rounded flex items-center relative group">
				<button on:click={() => {onDelete(item.item_id)}} class="group-hover:opacity-100 opacity-0 absolute top-1 right-1 w-8 h-8 rounded-full hover:bg-gray-100 cc transition">
					<Icon name="trash" className="w-3 text-red-500"/>
				</button>
				<img src={item.thumbnail_path} class="w-20" alt={item.name}>
				<p class="px-4 py-2 leading-tight text-gray-600">{item.name}</p>
			</div>
		{/each}
	</div>
</div>