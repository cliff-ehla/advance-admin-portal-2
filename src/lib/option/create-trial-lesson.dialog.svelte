<script>
	import {http} from "$lib/http";
	import Button from '$lib/ui-elements/button.svelte'
	import TemplateTextBox from '$lib/ui-elements/template-text-box.svelte'
	import MaterialSelectionList from '$lib/material/material-selection-list.svelte'
	import {getContext} from 'svelte'
	import {course_title_options_store} from "../../store/course-title-options-store";

	const {openModal, closeModal} = getContext('simple-modal')

	export let reserved_id
	export let student_name
	export let teacher_name
	export let teacher_profile_pic
	export let date_display
	export let time_display
	export let onSuccess = () => {}

	let selected_item
	let lesson_fee
	let app_fee
	let course_title
	let step = 1
	$: selected_item_id = selected_item ? selected_item.item_id : null

	const onConfirm = async () => {
		const {success} = await http.post(fetch, '/zoomApi/confirm_zoom_trial_option', {
			reserved_id,
			app_fee,
			lesson_fee,
			item_id: selected_item_id,
			course_title
		}, {
			notification: '已經為學生建立了課堂'
		})
		if (success) onSuccess()
		closeModal()
	}
</script>

<div class="flex items-center border-gray-300 border-b pt-4 pb-2 px-4">
	<div class="w-16 text-center overflow-hidden flex-shrink-0">
		<img src={teacher_profile_pic} alt="student"
		     class="rounded-full w-12 h-12 mx-auto border border-gray-500">
		<p class="font-bold text-center mt-1.5 text-xs whitespace-nowrap">
			{teacher_name}
		</p>
	</div>
	<div class="w-16 text-center overflow-hidden flex-shrink-0 ml-4">
		<img src="/student-f-icon.jpg" alt="student"
		     class="rounded-full w-12 h-12 mx-auto border border-gray-500">
		<p class="font-bold text-center mt-1.5 text-xs whitespace-nowrap">
			{student_name}
		</p>
	</div>
	<div class="ml-4">
		<p class="font-bold">{date_display}</p>
		<p>{time_display}</p>
	</div>
</div>

<div class="p-4" style="height: 680px">
	{#if step === 1}
		<div style="max-width: 280px">
			<label for="app-fee">App fee</label>
			<input id="app-fee" bind:value={app_fee} class="input" type="number" placeholder="App fee (i.e. 50)">
			<label for="lesson-fee">Lesson fee</label>
			<input id="lesson-fee" bind:value={lesson_fee} class="input" type="number" placeholder="Lesson fee (i.e. 500)">
			<label for="lesson-fee">Course title</label>
			<TemplateTextBox value={course_title} on:input={e => {course_title = e.detail}} options={$course_title_options_store} placeholder="Course title"/>
		</div>
	{:else if step === 2}
		<MaterialSelectionList max_height="600px" on:input={e => selected_item = e.detail}/>
	{:else if step === 3}
		<div class="flex items-center">
			<img src={selected_item.thumbnail_path} alt="img" class="w-40 rounded">
			<div class="ml-8">
				<p class="font-bold">Course title: {course_title}</p>
				<p>App fee: HKD{app_fee}</p>
				<p>Lesson fee: HKD{lesson_fee}</p>
			</div>
		</div>
	{/if}
</div>

<div class="flex justify-between p-4">
	{#if step === 1}
		<button on:click={closeModal} class="flex-1 bg-gray-100 hover:border-gray-400 border border-gray-200 rounded px-1 py-1">取消</button>
		<Button disabled={!(typeof app_fee === 'number' && typeof lesson_fee === 'number' && course_title)} button_class="flex-1 py-2 ml-4" on:click={() => {step = 2}}>下一步</Button>
	{:else if step === 2}
		<button on:click={() => {step = 1}} class="flex-1 bg-gray-100 hover:border-gray-400 border border-gray-200 rounded px-1 py-1">上一步</button>
		<Button disabled={!selected_item_id} button_class="flex-1 py-2 ml-4" on:click={() => {step = 3}}>下一步</Button>
	{:else if step === 3}
		<button on:click={() => {step = 2}} class="flex-1 bg-gray-100 hover:border-gray-400 border border-gray-200 rounded px-1 py-1">上一步</button>
		<Button button_class="flex-1 py-2 ml-4" on:click={onConfirm}>確定建立課堂</Button>
	{/if}
</div>

<style>
	label, input {
			@apply block;
	}
	label {
			@apply mt-2 text-sm mb-0.5 text-gray-500;
	}
	input {
			@apply w-full;
	}
</style>