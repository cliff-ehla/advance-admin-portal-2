<script>
	import {getMaterialList} from "../../store/org-api";
	import {createEventDispatcher} from 'svelte'
	import Icon from '../ui-elements/icon.svelte'
	import {category_list} from "$lib/store/category-list";
	import {http} from "$lib/http.js";

	const dispatch = createEventDispatcher()

	export let max_height = 'auto'
	export let category = 'Trial Lessons'

	let items = []
	let selected_filter
	let filters = []
	let previews
	$: filtered_items = items.filter(item => item.level === selected_filter)

	let selected_item_id
	let preview_thumbs

	$: {
		if (category) {
			fetchData()
		}
	}

	const onPreview = async (item) => {
		let {data} = await http.post(fetch, '/itemApi/get_by_ids', {
			ids: [item.id]
		})
		previews = data[0].pdf_array
	}

	const fetchData = async () => {
		const data = await getMaterialList(category)
		items = data.unselected_items
		filters = data.tag_ordering
		selected_filter = filters[0]
	}

	const onSelectItem = async (item) => {
		selected_item_id = item.id
		dispatch('input', {
			item_id: selected_item_id,
			title: item.name,
			thumbnail_path: item.thumbnail_path
		})
	}

	const onFilterSelect = (f) => {
		preview_thumbs = null
		selected_filter = f
	}
</script>

<div class="flex">
	{#if previews}
		<div class="absolute z-40 inset-0 bg-white" on:click={() => {previews = null}}>
			{#each previews as src}
				<img {src} alt="yyo">
			{/each}
		</div>
	{/if}
	<div class="w-32">
		{#each $category_list as item}
			<button class:text-blue-500={category === item} on:click={() => {category = item}} class="py-2 border-b border-gray-200">
				{item}
			</button>
		{/each}
	</div>
	<div class="flex-1">
		<div class="h-16 flex text-sm text-gray-300 px-8 border-b border-gray-300 bg-gray-100 items-center overflow-x-scroll" style="max-width: 740px">
			{#if filters}
				{#each filters as f}
					<div on:click={() => {onFilterSelect(f)}} class="{selected_filter === f ? 'bg-blue-500 text-white' : 'bg-white text-blue-500 border-blue-500 border'} cursor-pointer px-2 py-1 mx-1 rounded whitespace-nowrap">{f}</div>
				{/each}
			{/if}
		</div>
		<div>
			<div class="grid grid-cols-3 gap-4 px-4 py-8 overflow-y-scroll" style="max-height: {max_height};">
				{#if filtered_items.length}
					{#each filtered_items as item}
						<div class="text-center border border-gray-100 shadow-lg rounded overflow-hidden">
							<div class="bg-center bg-cover relative" style="background-image: url({item.thumbnail_path})">
								<div on:click={() => onSelectItem(item)} class="{item.id === selected_item_id ? 'bg-blue-500 text-white border-2 border-white' : 'bg-white border-2 border-blue-500'} cursor-pointer w-6 h-6 rounded flex items-center justify-center absolute right-2 top-2 shadow-lg">
									{#if item.id === selected_item_id}
										<Icon name="tick" className="w-4"/>
									{/if}
								</div>
								<button on:click={() => {onPreview(item)}} class="button-secondary absolute bottom-2 right-2 bg-white">
									Preview
								</button>
								<div style="padding-top: 80%"></div>
							</div>
							<div class="text-sm leading-tight py-4 px-2">
								<p>{item.name}</p>
							</div>
						</div>
					{/each}
				{:else}
					<div class="p-4">No items</div>
				{/if}
			</div>
		</div>
	</div>
</div>