<script>
	import {http} from "$lib/http";
	import Button from '$lib/ui-elements/button.svelte'
	import MaterialSelectionList from '$lib/material/material-selection-list.svelte'

	export let reserved_id
	export let student_name
	export let teacher_name
	export let teacher_profile_pic
	export let date_display
	export let time_display

	let selected_item_id
	let lesson_fee
	let app_fee
	let course_title
	let step = 1

	const onConfirm = () => {
		http.post(fetch, '/zoomApi/confirm_zoom_trial_option', {
			reserved_id,
			app_fee,
			lesson_fee,
			item_id: selected_item_id,
			course_title
		}, {
			notification: '已經為學生建立了課堂'
		})
	}
</script>

<div class="flex items-center border-gray-300 border-b py-1 px-4">
	<div class="w-16 text-center overflow-hidden flex-shrink-0">
		<img src={teacher_profile_pic} alt="student"
		     class="rounded-full w-12 h-12 mx-auto border border-gray-500">
		<p class="font-bold text-center mt-1.5 text-xs whitespace-nowrap">
			{teacher_name}
		</p>
	</div>
	<div class="w-16 text-center overflow-hidden flex-shrink-0">
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

<div class="p-4 h-96 w-96">
	{#if step === 1}
		<label for="app-fee">App fee</label>
		<input id="app-fee" class="input" type="text" placeholder="App fee">
		<label for="lesson-fee">Lesson fee</label>
		<input id="lesson-fee" class="input" type="text" placeholder="Lesson fee">
	{:else if step === 2}
		<MaterialSelectionList/>
	{:else if step === 3}
		Summary:
	{/if}
</div>

<div class="flex justify-between p-4">
	<button class="flex-1 bg-gray-100 hover:border-gray-400 border border-gray-200 rounded px-1 py-1">取消</button>
	{#if step === 1}
		<Button button_class="flex-1 py-2 ml-4" on:click={() => {step = 2}}>下一步</Button>
	{:else if step === 2}
		<Button button_class="flex-1 py-2 ml-4" on:click={() => {step = 3}}>下一步</Button>
	{:else if step === 3}
		<Button button_class="flex-1 py-2 ml-4" on:click={onConfirm}>確定建立課堂</Button>
	{/if}
</div>

<style>
	label, input {
			@apply block;
	}
</style>