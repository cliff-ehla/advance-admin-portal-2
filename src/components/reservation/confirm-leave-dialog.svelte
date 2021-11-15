<script>
	import {course_lesson_tbc_selection} from "../../store/calendar-action-status-store";
	import {action_status} from "../../store/calendar-action-status-store";
	import {tutor_store} from "../../store/tutor-store";
	import {createLeaveTime} from "../../api/tutor-api";
	import dayjs from "dayjs";
	import utc from "dayjs/plugin/utc"
	dayjs.extend(utc)
	import {getContext} from 'svelte'
	const {closeModal} = getContext('simple-modal')

	let loading

	const onConfirm = async () => {
		if (loading) return
		const is_error = $course_lesson_tbc_selection.some(s => !s.teacher_id)
		if (is_error) return alert('error: teacher id is missing')
		let leave_times = $course_lesson_tbc_selection.map(sel => ({
			start_date: dayjs(sel.start_date).utc().format('YYYY-MM-DD HH:mm:ss'),
			end_date: dayjs(sel.end_date).utc().format('YYYY-MM-DD HH:mm:ss'),
			tutor_id: sel.teacher_id,
			remark: ' '
		}))
		loading = true
		await createLeaveTime({leave_times})
		course_lesson_tbc_selection.set([])
		action_status.set('')
		closeModal()
	}
</script>

<div class="flex items-stretch">
	<div class="flex-1 mr-4 p-4">
		<p class="mb-4 text-t1 font-bold">Confirm Annual Leave</p>
		<div class="pl-2 border-l-4 border-yellow-700">
			{#each $course_lesson_tbc_selection as selection}
				<div class="px-4 py-2 border-b border-gray-200 flex items-center">
					<div class="flex-1">
						<p class="font-bold mb-2 text-lg">
							{tutor_store.getTutorName(selection.teacher_id)}
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

		<div class="mt-4">
			<button on:click={onConfirm} disabled={loading} class="{!loading ? 'bg-blue-500 hover:bg-blue-600 text-white' : 'bg-gray-400 text-white'} p-4 w-full rounded-full">{loading ? 'Creating...' : 'Confirm'}</button>
		</div>
	</div>
</div>