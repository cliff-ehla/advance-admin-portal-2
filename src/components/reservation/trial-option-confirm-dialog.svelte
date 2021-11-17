<script>
	import {course_lesson_tbc_selection, editing_option} from "../../store/calendar-action-status-store";
	import {action_status} from "../../store/calendar-action-status-store";
	import {tutor_store} from "../../store/tutor-store";
	import {createZoomOption, addZoomOption} from "../../api/zoom-api";
	import dayjs from "dayjs";
	import utc from "dayjs/plugin/utc.js"
	import StudentSelectionBox from '../../components/student/student-selection-box.svelte'
	dayjs.extend(utc)
	import {getContext} from 'svelte'
	const {closeModal} = getContext('simple-modal')
	import {goto} from '$app/navigation'

	let tel = $editing_option.phone || ''
	let remark = $editing_option.remark || ''
	let selected_student_id
	let loading

	const getTutor = (id) => {
		let obj = $tutor_store.find(t => t.user_id === id)
		return obj && obj.nickname
	}

	const onConfirm = async () => {
		if (loading) return
		if (!(tel || selected_student_id)) return
		let grouper_id = $editing_option.grouper_id
		const is_error = $course_lesson_tbc_selection.some(s => !s.teacher_id)
		if (is_error) return alert('error: teacher id is missing')
		let zoom_reserved = $course_lesson_tbc_selection.map(sel => ({
			start_date: dayjs(sel.start_date).utc().format('YYYY-MM-DD HH:mm:ss'),
			end_date: dayjs(sel.end_date).utc().format('YYYY-MM-DD HH:mm:ss'),
			teacher_id: sel.teacher_id
		}))
		loading = true
		if (grouper_id) {
			await addZoomOption({
				grouper_id,
				zoom_reserved
			})
		} else {
			await createZoomOption({
				remark: remark || ' ',
				phone: tel,
				student_id: selected_student_id,
				is_trial: true,
				zoom_reserved
			})
		}
		course_lesson_tbc_selection.reset()
		action_status.set('')
		goto('/booking/trial-option?status=not-confirm')
		closeModal()
	}
</script>

<div class="flex items-stretch">
	<div class="flex-1 mr-4 p-4">
		<p class="mb-4 text-t1 font-bold">{$editing_option.grouper_id ? 'Add' : 'Create' } {$course_lesson_tbc_selection.length} reservation for</p>

		<div class="my-4">
			<input type="tel" bind:value={tel} placeholder="Tel number" class="border px-4 py-2 border-gray-300 rounded w-full">
			<p class="my-2">- or -</p>
			<StudentSelectionBox on:input={e => {selected_student_id = e.detail}} selected_value={selected_student_id}/>
		</div>

		<div class="pl-2 border-l-4 border-yellow-700">
			{#each $course_lesson_tbc_selection as selection}
				<div class="px-4 py-2 border-b border-gray-200 flex items-center">
					<div class="flex-1">
						<p class="font-bold mb-2 text-lg">
							{getTutor(selection.teacher_id)}
						</p>
						<div class="flex">
							<div class="font-bold">{dayjs(selection.start_date).format('MMM DD YYYY (ddd)')},</div>
							<div>{dayjs(selection.start_date).format('HH:mm')}</div> -
							<div>{dayjs(selection.end_date).format('HH:mm')}</div>
						</div>
					</div>
				</div>
			{/each}
		</div>

		<textarea class="px-2 py-4 w-full border border-gray-300 my-2" bind:value={remark} rows="2" placeholder="Remark (optional)"></textarea>

		<div class="mt-4">
			<button on:click={onConfirm} disabled={!(tel || selected_student_id) || loading} class="{(tel || selected_student_id || loading) ? 'bg-blue-500 hover:bg-blue-600 text-white' : 'bg-gray-400 text-white'} p-4 w-full rounded-full">{loading ? 'Creating...' : 'Confirm'}</button>
		</div>
	</div>
	<div class="w-72 p-4 border-l border-gray-300 bg-gray-100">
		<p>Preview message</p>
		<p>


		</p>
	</div>
</div>