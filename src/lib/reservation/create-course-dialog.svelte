<script>
	import {onMount} from 'svelte'
	import {course_lesson_tbc_selection, calendar_store} from "../../store/calendar-action-status-store";
	import {action_status} from "../../store/calendar-action-status-store";
	import dayjs from "dayjs";
	import {tutor_store} from "../../store/tutor-store";
	import {http} from "$lib/http.js";
	import {create_course_from_trial_store} from "../../store/create-course-from-trial-store";
	import TemplateTextBox from '../../lib/ui-elements/template-text-box.svelte'
	import SelectionBox from '../../lib/ui-elements/selection-box.svelte'
	import Button from '$lib/ui-elements/button.svelte'
	import StudentSelectionBox from '../../lib/student/student-selection-box.svelte'
	import CopyMessageTextBox from '$lib/option/copy-message-textbox.svelte'
	import {goto} from '$app/navigation'
	import {getContext} from 'svelte'
	import {student_store} from "../../store/student-store";
	const {closeModal} = getContext('simple-modal')
	import {syllabus_store} from "../../store/syllabus-store";
	import {listSyllabus} from "../../api/syllabus-api";
	import {course_title_options_store} from "../../store/course-title-options-store.js";
	import {tutor_event_store} from "$lib/store/tutor-event-store.js";

	const teacher_id = $calendar_store.teacher_id
	const student_id = $calendar_store.student_id
	const voucher_id = $calendar_store.voucher_id

	$: teacherName = $course_lesson_tbc_selection.length ? tutor_store.getTutorName($course_lesson_tbc_selection[0].teacher_id) : ''
	$: studentName = student_id ? student_store.getStudentName(student_id) : $create_course_from_trial_store ? $create_course_from_trial_store.students[0].nickname : undefined
	let first_lesson = $course_lesson_tbc_selection[0]
	let duration = dayjs(first_lesson.end_date).diff(dayjs(first_lesson.start_date), 'minute')
	let sorted_lessons = $course_lesson_tbc_selection.sort((a,b) => {
		return dayjs(a.start_date).isBefore(dayjs(b.start_date)) ? -1 : 1
	})

	let course_title = ''
	let loading
	let message
	let message_note = genMessage2()
	let is_renewal
	let step = 1

	$: {
		if (step === 2)
			message = genMessage()
	}

	let selected_course_id
	$: selected_course = selected_course_id ? $syllabus_store.find(item => item.syllabus_id === selected_course_id) : ''

	onMount(async () => {
		let d = await listSyllabus()
		syllabus_store.set(d)
	})

	const onConfirm = async () => {
		const zoom_reserved_utc = $course_lesson_tbc_selection.map(s => {
			return {
				start_date: dayjs(s.start_date).utc().format('YYYY-MM-DD HH:mm:ss'),
				end_date: dayjs(s.end_date).utc().format('YYYY-MM-DD HH:mm:ss'),
				teacher_id
			}
		})
		const {data} = await http.post(fetch, '/zoomApi/create_zoom_real_reserved', {
			student_id,
			title: course_title,
			related_trial_zoom_id: $create_course_from_trial_store.wrapper_id,
			zoom_reserved: zoom_reserved_utc,
			syllabus: selected_course.syllabus,
			syllabus_id: selected_course.syllabus_id
		}, {
			notification: '成功'
		})
		await http.post(fetch, '/zoomApi/confirm_zoom_real_reserved', {
			voucher_id,
			is_renewal,
			grouper_id: data.grouper_id,
			confirm_summary: message
		}, {
			notification: '已經建立課堂'
		})
		await goto(`/students/${student_id}`)

		action_status.set('')
		calendar_store.clear()
		course_lesson_tbc_selection.reset()
		closeModal()
	}

	const genMessage = () => {
		let l_0 = `家長你好，以下是${studentName}的正式課堂schedule，給你記錄，謝謝！`
		let l_1 = `Teacher: ${teacherName}`
		let l_x = `Student: ${studentName}`
		let l_2 = `Formal Lessons (${$course_lesson_tbc_selection.length} lessons@${duration}mins)`
		let l_3 = course_title
		let lines = $course_lesson_tbc_selection.map(lesson => {
			return `${dayjs(lesson.start_date).format('MMM DD (ddd) hh:mma')} - ${dayjs(lesson.end_date).format('hh:mma')}`
		})

		let msg = l_0 + '\n' + '\n' + l_1 + '\n' + l_2 + '\n' + l_3 +'\n' + l_x + '\n' + '\n'
		lines.forEach(l => {
			msg += l + '\n'
		})

		return msg
	}

	function genMessage2 () {
		let l_4 = '【請假安排】學生請假需要提早至少24小時通知。如果課堂當天病假，需要提供醫生紙。我們會和家長以及老師在一起商討及確定補課時間。當天請假不能獲得補課，因為老師時間已經預留咗出來，已經不可能讓給其他學生，這樣非常浪費資源。敬請理解，謝謝。😊'
		let l_5 = '備註：'
		let l_6 = '1. 每一期(16堂以內)報名，學生病假(需提供醫生證明)加事假補課次數上限：3次'
		let l_7 = '2. 如果沒有病假，則事假補課次數上限為2次'
		let l_8 = 'Taking Leave Policy'
		let l_9 = 'Students requesting for leave need to give us at least 24 hours in advance notice.  If it\'s a sick leave on the day of class, you need to obtain a doctor\'s recommendation.  We will work with parents and teachers to rearrange a make-up lesson.  If you ask for leave on the day of lesson, no make-up lesson will be arranged because the teacher’s time has already been reserved and it is impossible to give it to other students. This is a waste of resources. We hope you can understand, thank you very much!'
		let l_10 = 'Remark:'
		let l_11 = '1. The maximum no. of sick leave (doctor\'s certificate required) plus personal leave make-up lessons: 3'
		let l_12 = '2. If there is no sick leave, the upper limit of the no. of make-up lessons for personal leave is 2.'
		return l_4 + '\n' + l_5 + '\n' + l_6 + '\n' + l_7 + '\n' + '\n' + l_8 + '\n' + l_9 + '\n' + l_10 + '\n' + l_11 + '\n' + l_12
	}

	const onLevelSelected = (lv, s) => {
		s.levels = lv
	}
</script>

<div class="relative" style="max-height: calc(100vh - 200px); width: 600px">
	<p class="font-bold text-lg mb-4">建立正式課堂</p>

	{#if step === 1}
		<div class="grid grid-cols-2 gap-4">
			<div>
				<label>學生</label>
				<StudentSelectionBox selected_value={student_id} on:input={e => {student_id = e.detail}}/>
			</div>
			<div>
				<label>老師</label>
				<SelectionBox selected_value={teacher_id}
				              on:input={e => {teacher_id = e.detail}}
				              label_key="nickname"
				              value_key="user_id"
				              options={$tutor_store}/>
			</div>
		</div>

		<div class="grid grid-cols-2 gap-4 mb-4">
			<div>
				<div class="flex items-center mt-2">
					<div class="whitespace-nowrap text-gray-400">Is renewal</div>
					<input bind:checked={is_renewal} class="w-4 h-4 ml-4" type="checkbox">
				</div>
			</div>
			<div>
				<label class="text-xs text-gray-500 mb-1">Course title</label>
				<TemplateTextBox class="border border-gray-300 p-4 rounded" value={course_title} on:input={e => {course_title = e.detail}} options={$course_title_options_store} placeholder="Course title"/>
				<label>Course structure</label>
				{#if $syllabus_store}
					<SelectionBox on:input={e => {selected_course_id = e.detail}} selected_value={selected_course_id} options={$syllabus_store} subtitle_key="description" value_key="syllabus_id" label_key="name" placeholder="Course structure"/>
				{/if}

				{#if selected_course}
					<div class="bg-gray-100 p-2">
						{#each selected_course.syllabus as s}
							<div class="flex items-center p-1">
								<p class="flex-1">{s.category_type}</p>
								<div class="w-40">
									<SelectionBox on:input={(e) => {onLevelSelected(e.detail, s)}} simple_array selected_value={s.levels} options={s.category_level}/>
								</div>
							</div>
						{/each}
					</div>
				{/if}
			</div>
		</div>

		<div class="bg-blue-50 p-4" style="min-height: 300px;">
			<p class="text-sm text-gray-500 mb-1 border-b border-gray-300 pb-1">Total {$course_lesson_tbc_selection.length} Lessons:</p>
			{#each sorted_lessons as lesson, i}
				<div class="h-10 flex items-center text-sm">
					<div class="w-6 text-gray-400 text-sm">{i + 1}</div>
					<p>{dayjs(lesson.start_date).format('MMM DD (ddd), hh:mma')}</p> -
					<p>{dayjs(lesson.end_date).format('hh:mma')}</p>
				</div>
			{/each}
		</div>
	{:else if step === 2}
		<p class="mb-4">課堂總結：</p>
		<CopyMessageTextBox msg={message} rows={10}/>
		<CopyMessageTextBox msg={message_note} rows={5}/>
	{/if}
	
	<div class="flex justify-between mt-4">
		{#if step === 1}
			<button on:click={closeModal} class="flex-1 bg-gray-100 hover:border-gray-400 border border-gray-200 rounded px-1 py-1">取消</button>
			<Button disabled={!(voucher_id && course_title && student_id && teacher_id)} button_class="flex-1 py-2 ml-4" on:click={() => {step = 2}}>下一步</Button>
		{:else if step === 2}
			<button on:click={() => {step = 1}} class="flex-1 bg-gray-100 hover:border-gray-400 border border-gray-200 rounded px-1 py-1">上一步</button>
			<Button button_class="flex-1 py-2 ml-4" on:click={onConfirm}>確定建立課堂</Button>
		{/if}
	</div>
</div>

<style>
	label, input {
		@apply block;
	}
	label {
		@apply mt-2 text-sm mb-0.5 text-gray-500;
	}
	input[type="text"], input[type="number"] {
		@apply w-full;
	}
</style>
