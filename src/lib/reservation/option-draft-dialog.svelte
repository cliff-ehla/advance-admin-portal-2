<script>
	import {draftZoomOption} from "../../api/zoom-api";
	import {getContext} from 'svelte'
	import SelectionBox from '../ui-elements/selection-box.svelte'
	const {showNotification} = getContext('notification')
	const {closeModal} = getContext('simple-modal')
	import {level_options_store, gender_options_store} from "../../store/level-options";
	import {course_title_options_store} from "../../store/course-title-options-store";
	import TemplateTextBox from '../../lib/ui-elements/template-text-box.svelte'

	export let s_nickname
	export let course
	export let material
	export let age
	export let lv
	export let gender
	export let general_message
	export let grouper_id
	export let is_edit_after_confirm = false
	export let onConfirm = () => {}
	export let onSaveDraft = () => {}

	const onSaveDraftClick = async () => {
		await draftZoomOption({
			grouper_id, s_nickname, gender, course, material, age, lv, general_message,
			is_confirmed: false
		})
		closeModal()
		onSaveDraft()
		showNotification('Saved')
	}

	const onConfirmClick = async () => {
		if (confirm('confirm?')) {
			await draftZoomOption({
				grouper_id, s_nickname, gender, course, material, age, lv, general_message,
				is_confirmed: true
			})
			closeModal()
			onConfirm()
		}
	}
</script>

<div class="p-4">
	<h1 class="font-bold mb-4 text-lg">Voucher No: <b>TL20210903</b> (WIP)</h1>

	<div class="mb-4">
		<p class="mb-1">Nickname</p>
		<input bind:value={s_nickname}
		       class="border border-gray-300 rounded px-4 py-2 w-full"
		       placeholder="Nickname"
		       type="text"/>
	</div>

	<div class="mb-4">
		<p class="mb-1">Course</p>
		<TemplateTextBox value={course} on:input={e => {course = e.detail}} options={$course_title_options_store} placeholder="Course title"/>
	</div>

	<div class="mb-4">
		<p class="mb-1">Material</p>
		<input bind:value={material}
		       class="border border-gray-300 rounded px-4 py-2 w-full"
		       placeholder="Material"
		       type="text"/>
	</div>

	<div class="mb-4">
		<p class="mb-1">Age</p>
		<input bind:value={age}
		       class="border border-gray-300 rounded px-4 py-2 w-full"
		       placeholder="Age"
		       type="text"/>
	</div>

	<div class="mb-4">
		<p class="mb-1">Level</p>
		<SelectionBox placeholder="level" options={$level_options_store} selected_value={lv} on:input={e => {lv = e.detail}}/>
	</div>

	<div class="mb-4">
		<p class="mb-1">Gender</p>
		<SelectionBox placeholder="gender" options={$gender_options_store} selected_value={gender} on:input={e => {gender = e.detail}}/>
	</div>

	<div class="mb-4">
		<p class="mb-1">Additional note</p>
		<textarea bind:value={general_message}
		          class="border border-gray-300 rounded px-4 py-2 w-full h-32"
		          placeholder="General message"
		></textarea>
	</div>

	<div class="flex mt-4 w-full">
		{#if !is_edit_after_confirm}
			<button class="flex-1 border border-gray-300 px-4 py-2 rounded" on:click={onSaveDraftClick}>Save draft</button>
		{/if}
		<div class="ml-4 flex-1">
			<button class="flex-1 bg-blue-500 hover:bg-blue-700 text-white px-4 py-2 rounded w-full" on:click={onConfirmClick}>Confirm draft</button>
		</div>
	</div>
</div>
