<script context="module">
	import {tutor_event_store} from "$lib/store/tutor-event-store.js";

	export const load = async ({page, fetch}) => {
		await tutor_event_store.callIfNoCache(fetch, {
			tutor_id: page.params.user_id
		})
		return true
	}
</script>

<script>
	import {goto} from '$app/navigation'
	import {page} from '$app/stores'
	import TutorMonthCalendar from '../../../lib/calendar/tutor-month-calendar.svelte'

	const onMonthChange = (e) => {
		goto(`/tutor/${$page.params.user_id}/${e.detail}`)
	}
</script>

<TutorMonthCalendar on:monthChange={onMonthChange} YYYY_MM={$page.params.YYYY_MM} tutor_id={$page.params.user_id}/>