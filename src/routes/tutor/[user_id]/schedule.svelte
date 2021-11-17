<script>
	import TutorWeekCalendar from '../../../components/calendar/tutor-week-calendar.svelte'
	import {page} from '$app/stores'
</script>

<TutorWeekCalendar tutor_id={$page.params.user_id}/>