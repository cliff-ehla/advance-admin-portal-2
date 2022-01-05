<script context="module">
	import {tutor_event_store} from "$lib/store/tutor-event-store.js";
	import {get} from 'svelte/store'

	export const load = async ({page, fetch}) => {
		if (get(tutor_event_store)[page.params.user_id]) {
			console.log('cached, skip')
			tutor_event_store.callIfNoCache(fetch, {
				tutor_id: page.params.user_id
			})
		} else {
			console.log('no cached, fetch data')
			await tutor_event_store.callIfNoCache(fetch, {
				tutor_id: page.params.user_id
			})
		}
		return true
	}
</script>

<script>
	import {page} from '$app/stores'
	import TutorMonthCalendar from '../../../lib/calendar/tutor-month-calendar.svelte'
</script>

<TutorMonthCalendar YYYY_MM={$page.params.YYYY_MM} tutor_id={$page.params.user_id}/>