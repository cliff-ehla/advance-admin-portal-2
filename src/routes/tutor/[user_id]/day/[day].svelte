<script>
	import {page} from '$app/stores'
	import TutorDayMultipleCalendar from '../../../../components/calendar/tutor-day-multiple-calendar.svelte'

</script>

<TutorDayMultipleCalendar tutor_id={$page.params.user_id} day={$page.params.day}/>