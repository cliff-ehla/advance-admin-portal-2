<script>
	import {http} from "$lib/http";
	import Button from '$lib/ui-elements/button.svelte'
	import TemplateTextBox from '$lib/ui-elements/template-text-box.svelte'
	import MaterialSelectionList from '$lib/material/material-selection-list.svelte'
	import {getContext} from 'svelte'
	import {course_title_options_store} from "../../store/course-title-options-store";
	import {student_store} from "../../store/student-store";
	import {tutor_store} from "../../store/tutor-store";
	import dayjs from "dayjs";

	const {openModal, closeModal} = getContext('simple-modal')

	export let reserved_id = undefined
	export let student_id
	export let teacher_id
	export let start_date // in utc
	export let end_date // in utc
	export let course_title = undefined
	export let onSuccess = () => {}

	let date_display = dayjs.utc(start_date).local().format('DD MMM YYYY')
	let time_display = dayjs.utc(start_date).local().format('HH:mma') + ' - ' + dayjs.utc(end_date).local().format('HH:mma')
	let selected_item
	let lesson_fee
	let app_fee
	let step = 1
	$: selected_item_id = selected_item ? selected_item.item_id : null
	$: teacher_name = tutor_store.getTutorName(teacher_id)
	$: teacher_profile_pic = tutor_store.getTutorProfilePic(teacher_id)

	const onConfirm = async () => {
		if (!reserved_id) { // if no reserved id is given, create the reserved id on the fly
			const {data} = await http.post(fetch, '/zoomApi/create_zoom_trial_option', {
				zoom_reserved: [{
					start_date: dayjs(start_date).format('YYYY-MM-DD HH:mm:ss'),
					end_date: dayjs(end_date).format('YYYY-MM-DD HH:mm:ss'),
					teacher_id: teacher_id
				}]
			}, {
				notification: '成功建立Option'
			})
			reserved_id = data.id
			console.log('cliff: ', 'reserved_id', data, reserved_id)
		}
		const {success} = await http.post(fetch, '/zoomApi/confirm_zoom_trial_option', {
			reserved_id,
			app_fee,
			lesson_fee,
			item_id: selected_item_id,
			course_title
		}, {
			notification: `已經為${student_store.getStudentName(student_id)}建立了$${teacher_name}的課堂, 於${date_display}`
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
		<img src="{student_store.getStudentAvatar(student_id)}" alt="student"
		     class="rounded-full w-12 h-12 mx-auto border border-gray-500">
		<p class="font-bold text-center mt-1.5 text-xs whitespace-nowrap">
			{student_store.getStudentName(student_id)}
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