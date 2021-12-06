<script>
	import SelectUserWidget from '../student/select-user-widget.svelte'
	import TemplateTextBox from '../../lib/ui-elements/template-text-box.svelte'
	import dayjs from "dayjs";
	import {tutor_store} from "../../store/tutor-store";
	import utc from "dayjs/plugin/utc.js";
	import {fetchStudentList} from "../../store/org-api";
	import {onMount} from 'svelte'
	import {course_lesson_tbc_selection} from "../../store/calendar-action-status-store";
	let slot = $course_lesson_tbc_selection.length ? $course_lesson_tbc_selection[0] : {}
	import {confirmZoomTrial} from "../../api/zoom-api";
	import {createZoomOption} from "../../api/zoom-api";
	import {getContext} from 'svelte'
	const {closeModal} = getContext('simple-modal')
	import {action_status} from "../../store/calendar-action-status-store";
	import {trial_lesson_retry_student_id} from "../../store/calendar-action-status-store";
	import {student_store} from "../../store/student-store";
	import MaterialSelectionList from '../../lib/material/material-selection-list.svelte'
	import {course_title_options_store} from "../../store/course-title-options-store";

	onMount(() => {
		if (!$student_store.length) fetchStudentList()
	})

	dayjs.extend(utc)

	let selected_student_id = $trial_lesson_retry_student_id
	let selected_item_id
	let loading
	let is_show_message
	let copy_text_el
	let message
	let tutor_group_title
	$: trial_lesson = $course_lesson_tbc_selection[0] || {}

	$: disabled = !(selected_student_id)

	const genMessage = () => {
		let line_1 = tutor_store.getTutorName(trial_lesson.teacher_id)
		let line_2 = `${dayjs(trial_lesson.end_date).diff(dayjs(trial_lesson.start_date), 'minute')} min Trial Lesson`
		let line_3 = `HKT: ${dayjs(trial_lesson.start_date).format('MMM (ddd)@h:mma')} - ${dayjs(trial_lesson.end_date).format('h:mma')}`
		let line_4 = `Student: ${student_store.getStudentName(selected_student_id)}`
		return line_1 + '\n' + line_2 + '\n' + line_3 + '\n' + line_4
	}

	const onConfirm = async () => {
		let payload = {
			remark: '',
			phone: '000', // just any string is work
			is_trial: true,
			zoom_reserved: $course_lesson_tbc_selection.map(sel => ({
				start_date: dayjs(sel.start_date).utc().format('YYYY-MM-DD HH:mm:ss'),
				end_date: dayjs(sel.end_date).utc().format('YYYY-MM-DD HH:mm:ss'),
				teacher_id: sel.teacher_id
			}))
		}
		let data = await createZoomOption(payload)
		let grouper_id = data.id
		let reserved_id = data.reserveds[0].id
		await confirmZoomTrial({
			reserved_id,
			student_id: selected_student_id,
			item_id: selected_item_id,
			grouper_id,
			tutor_group_title
		})
		message = genMessage()
		is_show_message = true
	}

	const onConfirmMessageClick = () => {
		copy_text_el.select()
		document.execCommand("copy");
		closeModal()
		setTimeout(() => {
			action_status.set('')
			course_lesson_tbc_selection.set([])
		}, 100)
	}
</script>

<div class="p-4 relative flex flex-col" style="height: calc(100vh - 40px)">
	<h2 class="font-bold text-lg mb-4">Create trial lesson</h2>

	<div class="overflow-scroll">
		<div class="bg-gray-100 border-blue-500 border-l-4 pr-2 py-2 pl-4">
			<p class="font-bold">{tutor_store.getTutorName(slot.teacher_id) || 'noname'}</p>
			<p>{dayjs(slot.start_date).format('MMM DD (ddd)@ h:mma')} - {dayjs(slot.end_date).format('h:mma')}</p>
		</div>

		<div class="mt-4">
			<SelectUserWidget {selected_student_id} on:input={e => {selected_student_id = e.detail}}/>
		</div>

		<div class="mt-4">
			<TemplateTextBox on:input={e => {tutor_group_title = e.detail}} options={$course_title_options_store} placeholder="Course title"/>
		</div>

		<MaterialSelectionList on:input={e => selected_item_id = e.detail.item_id}/>
	</div>

	<div class="mt-4">
		<button disabled={disabled || loading} on:click={onConfirm} class="{disabled || loading ? 'bg-gray-300 text-white' : 'bg-blue-500 hover:bg-blue-700 text-white'} rounded-full px-4 py-3 w-full">
			Create
		</button>
	</div>

	{#if is_show_message}
		<div class="absolute inset-0 bg-white bg-opacity-50 flex items-center justify-center">
			<div class="w-96 shadow-lg border border-gray-300 bg-white p-4 rounded">
				<p class="mb-4 font-bold">Confirm message</p>
				<textarea bind:this={copy_text_el} bind:value={message} cols="30" rows="10"></textarea>
				<div class="mt-4">
					<button class="bg-green-500 text-white rounded-full px-8 py-2 hover:bg-green-700" on:click={onConfirmMessageClick}>Copy and confirm</button>
				</div>
			</div>
		</div>
	{/if}
</div>