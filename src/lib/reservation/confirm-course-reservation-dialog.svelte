<script>
	import {onMount} from 'svelte'
	import {course_lesson_tbc_selection, edit_lesson_tbc_to_date} from "../../store/calendar-action-status-store";
	import {action_status} from "../../store/calendar-action-status-store";
	import dayjs from "dayjs";
	import {tutor_store} from "../../store/tutor-store";
	import {createZoomReserve} from "../../api/zoom-api";
	import {create_course_from_trial_store} from "../../store/create-course-from-trial-store";
	import TemplateTextBox from '../../lib/ui-elements/template-text-box.svelte'
	import SelectionBox from '../../lib/ui-elements/selection-box.svelte'
	import SelectionUserWidget from '../../lib/student/select-user-widget.svelte'
	import {goto} from '$app/navigation'
	import {getContext} from 'svelte'
	import {student_store} from "../../store/student-store";
	const {closeModal} = getContext('simple-modal')
	import {syllabus_store} from "../../store/syllabus-store";
	import {listSyllabus} from "../../api/syllabus-api";

	$: teacher_id = $course_lesson_tbc_selection[0] && $course_lesson_tbc_selection[0].teacher_id
	$: teacherName = $course_lesson_tbc_selection.length ? tutor_store.getTutorName($course_lesson_tbc_selection[0].teacher_id) : ''
	$: studentName = selected_student_id ? student_store.getStudentName(selected_student_id) : $create_course_from_trial_store ? $create_course_from_trial_store.students[0].nickname : undefined
	let first_lesson = $course_lesson_tbc_selection[0]
	let duration = dayjs(first_lesson.end_date).diff(dayjs(first_lesson.start_date), 'minute')
	let sorted_lessons = $course_lesson_tbc_selection.sort((a,b) => {
		return dayjs(a.start_date).isBefore(dayjs(b.start_date)) ? -1 : 1
	})

	let selected_title = ''
	let selected_student_id
	let loading
	let message
	let copy_text_el

	let course_title_options = [
		{
			value: 'Reading and Speaking Class',
			label: 'Reading and Speaking Class'
		},
		{
			value: 'Creative Writing Class',
			label: 'Creative Writing Class'
		},
		{
			value: 'Reading & Speaking, Reading Comprehension & Writing (P5/P6)',
			label: 'Reading & Speaking, Reading Comprehension & Writing (P5/P6)'
		}
	]

	let selected_course_id
	$: selected_course = selected_course_id ? $syllabus_store.find(item => item.syllabus_id === selected_course_id) : ''

	onMount(async () => {
		let d = await listSyllabus()
		syllabus_store.set(d)
	})

	const onProceed = () => {
		message = genMessage()
	}

	const onConfirm = () => {
		if (loading) return
		loading = true
		copy_text_el.select()
		document.execCommand("copy");
		let is_error = $course_lesson_tbc_selection.some(s => !s.teacher_id)
		if (is_error) return alert('error: teacher id is missing')
		const zoom_reserved_utc = $course_lesson_tbc_selection.map(s => {
			return {
				start_date: dayjs(s.start_date).utc().format('YYYY-MM-DD HH:mm:ss'),
				end_date: dayjs(s.end_date).utc().format('YYYY-MM-DD HH:mm:ss'),
				teacher_id: s.teacher_id
			}
		})
		action_status.set('')
		course_lesson_tbc_selection.reset()
		createZoomReserve({
			related_trial_zoom_id: $create_course_from_trial_store.wrapper_id,
			title: selected_title + `(${studentName})`,
			student_id: selected_student_id,
			remark: '',
			phone: '',
			zoom_reserved: zoom_reserved_utc,
			syllabus: selected_course.syllabus,
			syllabus_id: selected_course.syllabus_id,
		})
		goto('/booking/reservation')
		closeModal()
		loading = false
	}

	const genMessage = () => {
		let l_0 = `家長你好，以下是${studentName}的正式課堂schedule，給你記錄，謝謝！`
		let l_1 = `Teacher: ${teacherName}`
		let l_2 = `Formal Lessons (${$course_lesson_tbc_selection.length} lessons@${duration}mins)`
		let l_3 = selected_title
		let l_x = studentName
		let lines = $course_lesson_tbc_selection.map(lesson => {
			return `${dayjs(lesson.start_date).format('MMM DD (ddd) hh:mma')} - ${dayjs(lesson.end_date).format('hh:mma')}`
		})
		let l_4 = '【請假安排】學生請假需要提早至少24小時通知。如果課堂當天病假，需要提供醫生紙。我們會和家長以及老師在一起商討及確定補課時間。當天請假不能獲得補課，因為老師時間已經預留咗出來，已經不可能讓給其他學生，這樣非常浪費資源。敬請理解，謝謝。😊'
		let l_5 = '備註：'
		let l_6 = '1. 每一期(16堂以內)報名，學生病假(需提供醫生證明)加事假補課次數上限：3次'
		let l_7 = '2. 如果沒有病假，則事假補課次數上限為2次'
		let l_8 = 'Taking Leave Policy'
		let l_9 = 'Students requesting for leave need to give us at least 24 hours in advance notice.  If it\'s a sick leave on the day of class, you need to obtain a doctor\'s recommendation.  We will work with parents and teachers to rearrange a make-up lesson.  If you ask for leave on the day of lesson, no make-up lesson will be arranged because the teacher’s time has already been reserved and it is impossible to give it to other students. This is a waste of resources. We hope you can understand, thank you very much!'
		let l_10 = 'Remark:'
		let l_11 = '1. The maximum no. of sick leave (doctor\'s certificate required) plus personal leave make-up lessons: 3'
		let l_12 = '2. If there is no sick leave, the upper limit of the no. of make-up lessons for personal leave is 2.'
		let msg = l_0 + '\n' + '\n' + l_1 + '\n' + l_2 + '\n' + l_3 +'\n' + l_x + '\n' + '\n'
		lines.forEach(l => {
			msg += l + '\n'
		})
		msg = msg + '\n' + l_4 + '\n' + l_5 + '\n' + l_6 + '\n' + l_7 + '\n' + '\n' + l_8 + '\n' + l_9 + '\n' + l_10 + '\n' + l_11 + '\n' + l_12
		return msg
	}

	const onLevelSelected = (lv, s) => {
		s.levels = lv
	}
</script>

<div class="relative" style="max-height: calc(100vh - 200px); width: 600px">
	{#if message}
		<div class="z-50 absolute inset-0 bg-white bg-opacity-50 flex items-center justify-center">
			<div class="w-96 shadow-lg border border-gray-300 bg-white p-4 rounded">
				<p class="mb-4 font-bold">Confirm message</p>
				<textarea class="w-full h-96" bind:value={message} bind:this={copy_text_el} cols="30" rows="10"></textarea>
				<div class="mt-4 flex">
					<button on:click={() => {message = null}} class="border border-gray-200 rounded-full px-8 py-2">Cancel</button>
					<button class="bg-green-500 text-white rounded-full px-8 py-2 hover:bg-green-700 ml-4" on:click={onConfirm}>Copy and confirm</button>
				</div>
			</div>
		</div>
	{/if}
	<p class="font-bold mb-4">Create course</p>

	<div class="flex mb-4">
		<div class="flex-1">
			<p class="text-xs text-gray-500">Student name</p>
			<p class="font-bold">{studentName || '[student name]'}</p>
		</div>
		<div class="flex-1">
			<p class="text-xs text-gray-500">Teacher name</p>
			<SelectionBox selected_value={teacher_id}
			              label_key="nickname"
			              value_key="user_id"
			              options={$tutor_store}/>
		</div>
	</div>

	<div class="mb-4">
		<p class="text-xs text-gray-500 mb-1">Course title</p>
		<TemplateTextBox on:input={e => {selected_title = e.detail}} options={course_title_options} placeholder="Course title"/>
	</div>

	<div class="mb-4">
		<p class="text-xs text-gray-500 mb-1">Course structure</p>
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

	{#if !$create_course_from_trial_store}
		<div class="mb-4">
			<SelectionUserWidget on:input={e => {selected_student_id = e.detail}}/>
		</div>
	{/if}

	<p class="text-sm text-gray-500 mb-1 border-b border-gray-300 pb-1 font-bold">Total {$course_lesson_tbc_selection.length} Lessons</p>
	<div>
	{#each sorted_lessons as lesson, i}
		<div class="h-10 flex items-center">
			<div class="w-6 text-gray-400 text-sm">{i + 1}</div>
			<p>{dayjs(lesson.start_date).format('MMM DD (ddd) hh:mma')}</p> -
			<p>{dayjs(lesson.end_date).format('hh:mma')}</p>
		</div>
	{/each}
	</div>
	<div class="mt-4">
		<button on:click={onProceed} class="{loading ? 'bg-gray-400 text-white' : 'bg-blue-500 hover:blue-700 text-white'} rounded px-4 py-2 w-full">Confirm</button>
	</div>
</div>
