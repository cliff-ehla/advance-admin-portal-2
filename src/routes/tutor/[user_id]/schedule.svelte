<script>
	import TutorWeekCalendar from '../../../lib/calendar/tutor-week-calendar.svelte'
	import {page} from '$app/stores'
</script>

<TutorWeekCalendar tutor_id={$page.params.user_id}/>