<script>
	import {onMount} from "svelte";
	import {http} from "$lib/http.js";
	import SelectionBox from "$lib/ui-elements/selection-box.svelte"
	import Button from "$lib/ui-elements/button.svelte"
	import {tutor_store} from "../../store/tutor-store.js";
	import {getContext} from 'svelte'
	import {triggerReload} from "$lib/helper/trigger-reload.js";

	const {openModal, closeModal} = getContext('simple-modal')

	export let teacher_id
	let options
	let name_en
	let code_id
	let syllabus_id
	let title
	$: obj = options ? options.find(opt => opt.code_id === code_id) : undefined
	$: levels = obj && obj.levels
	$: disabled = !(syllabus_id && title)

	onMount(async () => {
		let {data} = await http.get(fetch, '/syllabusApi/list_syllabus_category')
		options = data
	})

	const onCreate = async () => {
		await http.post(fetch, '/tutorCourseApi/create_tutor_course', {
			teacher_id,
			title,
			syllabus_id
		}, {
			notification: `成功建立${tutor_store.getTutorName(teacher_id)}的課程框架`
		})
		triggerReload()
		closeModal()
	}
</script>

<div class="px-4">
	<h2 class="mb-4 text-xl">建立{tutor_store.getTutorName(teacher_id)}的課程框架</h2>
	<input type="text" class="input w-full mb-2" bind:value={title} placeholder="Course Title">
	{#if options}
		<SelectionBox {options} on:input={e => {code_id = e.detail}}
		              selected_value={code_id}
		              value_key="code_id" label_key="sub_cat_hk"/>
	{/if}
	{#if levels}
		<div class="mt-4">
			<SelectionBox options={levels} on:input={e => {syllabus_id = e.detail}}
			              selected_value={syllabus_id}
			              value_key="syllabus_id" label_key="level"/>
		</div>
	{/if}
	<div class="mt-8 flex justify-end">
		<Button {disabled} on:click={onCreate}>Create</Button>
	</div>
</div>