<script>
	import {goto} from '$app/navigation'
	import {page} from '$app/stores'
	import TutorMonthCalendar from '../../../lib/calendar/tutor-month-calendar.svelte'

	const onMonthChange = (e) => {
		goto(`/tutor/${$page.params.user_id}/${e.detail}`)
	}
</script>

<TutorMonthCalendar on:monthChange={onMonthChange} YYYY_MM={$page.params.YYYY_MM} tutor_id={$page.params.user_id}/>