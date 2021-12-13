<script>
	import dayjs from "dayjs";
	import {tutor_store} from "../../store/tutor-store";
	import {student_store} from "../../store/student-store";
	import {notifications} from "$lib/store/notification";

	export let course_title, end_date, start_date, student_id, teacher_id

	let msg = genMessage()
	console.log(msg)
	let copy_text_el

	function genMessage () {
		let line_1 = dayjs(end_date).diff(dayjs(start_date), 'minute') + ' min Trial Lesson'
		let line_2 = 'HKT: ' + dayjs.utc(start_date).local().format('DD MMM (ddd)@h:mma') + '-' + dayjs.utc(end_date).local().format('h:mma')
		let line_3 = 'Teacher:' + tutor_store.getTutorName(teacher_id)
		let line_4 = `Student: ${student_store.getStudentName(student_id)} (${student_store.getGender(student_id)})`
		let line_5 = `Level: ${student_store.getStudentLevel(student_id)}`
		let line_6 = `Topic: ${course_title}`
		return line_1 + '\n' + line_2 + '\n' + line_3 + '\n' + line_4 + '\n' + line_5+ '\n' + line_6
	}

	const onConfirmMessageClick = () => {
		copy_text_el.select()
		document.execCommand("copy")
		notifications.success('文字已複製')
	}
</script>

<div class="relative flex border border-gray-300 rounded">
	<textarea bind:this={copy_text_el} class="p-4" name="copy" cols="30" rows="7" value={msg}></textarea>
	<button class="bg-gray-100 cc px-1 text-sm border-l border-gray-300 hover:bg-blue-50" on:click={onConfirmMessageClick}>複製</button>
</div>