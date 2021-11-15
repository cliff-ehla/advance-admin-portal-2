<script>
	export let category_type
	export let category_level
	export let wrapper_id
	export let onSuccess = () => {}

	import SelectionBox from '../../components/ui-elements/selection-box.svelte'
	import {changeSyllabusCategory, listAllSyllabusCategory} from "../../api/syllabus-api";
	import {onMount} from "svelte";
	import {getContext} from 'svelte'
	const {closeModal} = getContext('simple-modal')

	let category_list
	let loading
	$: disabled = !category_level || loading

	const getLevelOptions = (type) => {
		let obj = category_list.find(cat => cat.category_type === type)
		return obj && obj.category_level
	}

	const onCategorySelect = (e) => {
		category_type = e.detail
		category_level = null
	}

	const onConfirm = async () => {
		if (disabled) return
		loading = true
		await changeSyllabusCategory({
			wrapper_id, category_type, category_level
		})
		loading = false
		closeModal()
		onSuccess()
	}

	onMount(async () => {
		category_list = await listAllSyllabusCategory()
	})
</script>

<p class="font-bold mb-4">Edit zoom category</p>

{#if category_list}
	<SelectionBox on:input={onCategorySelect}
	              options={category_list}
	              value_key="category_type" label_key="category_type"
	              selected_value={category_type} placeholder="Select category type"/>
	<div class="mt-4">
		{#if category_type}
			<SelectionBox on:input={e => {category_level = e.detail}}
			              options={getLevelOptions(category_type)}
			              value_key="category_type" label_key="category_type"
			              simple_array
			              selected_value={category_level} placeholder="Select level"/>
		{:else}
			<p class="text-gray-400 text-center">plz select type</p>
		{/if}
	</div>
{/if}

<div class="flex mt-4">
	<button class="py-2 px-8 rounded border border-gray-300" on:click={closeModal}>Cancel</button>
	<button class:opacity-30={disabled} class="py-2 px-8 rounded bg-blue-500 text-white ml-4" on:click={onConfirm}>{loading ? 'Loading...' : 'Confirm'}</button>
</div>