<script>
	import {http} from "$lib/http";
	import Button from '$lib/ui-elements/button.svelte'
	import TemplateTextBox from '$lib/ui-elements/template-text-box.svelte'
	import MaterialSelectionList from '$lib/material/material-selection-list.svelte'
	import CopyMessageTextBox from '$lib/option/copy-message-textbox.svelte'
	import {getContext} from 'svelte'
	import {course_title_options_store} from "../../store/course-title-options-store";
	import {student_store} from "../../store/student-store";
	import {tutor_store} from "../../store/tutor-store";
	import {calendar_store} from "../../store/calendar-action-status-store.js";
	import {tutor_event_store} from "$lib/store/tutor-event-store.js";
	import dayjs from "dayjs";

	const {openModal, closeModal} = getContext('simple-modal')

	export let reserved_id = undefined
	export let start_date // in utc
	export let end_date // in utc
	export let course_title = undefined
	export let onSuccess = () => {}

	const student_id = $calendar_store.student_id
	const teacher_id = $calendar_store.teacher_id
	const voucher_id = $calendar_store.voucher_id

	let date_display = dayjs.utc(start_date).local().format('DD MMM YYYY')
	let time_display = dayjs.utc(start_date).local().format('HH:mma') + ' - ' + dayjs.utc(end_date).local().format('HH:mma')
	let selected_item
	let step = 1
	let confirm_summary
	$: selected_item_id = selected_item ? selected_item.item_id : null
	$: teacher_name = tutor_store.getTutorName(teacher_id)
	$: teacher_profile_pic = tutor_store.getTutorProfilePic(teacher_id)
	$: {
		if (step === 3) {
			confirm_summary = genMessage()
		}
	}

	const onConfirm = async () => {
		if (!reserved_id) { // if no reserved id is given, create the reserved id on the fly
			const {data} = await http.post(fetch, '/zoomApi/create_zoom_trial_option', {
				zoom_reserved: [{
					start_date: dayjs(start_date).format('YYYY-MM-DD HH:mm:ss'),
					end_date: dayjs(end_date).format('YYYY-MM-DD HH:mm:ss'),
					teacher_id
				}]
			}, {
				notification: '成功建立Option'
			})
			await http.post(fetch, '/zoomApi/update_zoom_trial_option', {
				student_id,
				grouper_id: data.id
			}, {
				notification: '已把學生加入到Option'
			})
			reserved_id = data.reserveds[0].id
		}
		const {success} = await http.post(fetch, '/zoomApi/confirm_zoom_trial_option', {
			reserved_id,
			voucher_id,
			item_id: selected_item_id,
			course_title,
			confirm_summary
		}, {
			notification: `已經為${student_store.getStudentName(student_id)}建立了$${teacher_name}的課堂, 於${date_display}`
		})
		calendar_store.clear()
		if (success) onSuccess()
		closeModal()
	}

	function genMessage () {
		let line_1 = dayjs(end_date).diff(dayjs(start_date), 'minute') + ' min Trial Lesson'
		let line_2 = 'HKT: ' + dayjs.utc(start_date).local().format('DD MMM (ddd)@h:mma') + '-' + dayjs.utc(end_date).local().format('h:mma')
		let line_3 = 'Teacher:' + tutor_store.getTutorName(teacher_id)
		let line_4 = `Student: ${student_store.getStudentName(student_id)} (${student_store.getGender(student_id)})`
		let line_5 = `Level: ${student_store.getStudentLevel(student_id)}`
		let line_6 = `Topic: ${course_title}`
		return line_1 + '\n' + line_2 + '\n' + line_3 + '\n' + line_4 + '\n' + line_5+ '\n' + line_6
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
			<label>Course title</label>
			<TemplateTextBox value={course_title} on:input={e => {course_title = e.detail}} options={$course_title_options_store} placeholder="Course title"/>
		</div>
	{:else if step === 2}
		<MaterialSelectionList max_height="600px" on:input={e => selected_item = e.detail}/>
	{:else if step === 3}
		<div class="flex items-center">
			{#if selected_item}
				<img src={selected_item.thumbnail_path} alt="img" class="w-40 rounded">
			{/if}
			<div class:ml-8={selected_item}>
				<p class="font-bold mb-4">總結</p>
				<CopyMessageTextBox msg={confirm_summary}/>
			</div>
		</div>
	{/if}
</div>

<div class="flex justify-between p-4">
	{#if step === 1}
		<button on:click={closeModal} class="flex-1 bg-gray-100 hover:border-gray-400 border border-gray-200 rounded px-1 py-1">取消</button>
		<Button disabled={!(course_title)} button_class="flex-1 py-2 ml-4" on:click={() => {step = 2}}>下一步</Button>
	{:else if step === 2}
		<button on:click={() => {step = 1}} class="flex-1 bg-gray-100 hover:border-gray-400 border border-gray-200 rounded px-1 py-1">上一步</button>
		<Button button_class="flex-1 py-2 ml-4" on:click={() => {step = 3}}>下一步</Button>
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