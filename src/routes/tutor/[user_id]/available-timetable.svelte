<script>
	import {onMount} from 'svelte'
	import {fetchTutorAvailableTimeSlot} from "../../../api/tutor-api";
	import TimeTableList from '../../../lib/calendar/available-time-table-list.svelte'
	import {page} from '$app/stores'
	$: teacher_id = $page.params.user_id

	let data

	onMount(async () => {
		data = await fetchTutorAvailableTimeSlot($page.params.user_id)
	})
</script>

{#if data}
	<TimeTableList time_slot_list={data} {teacher_id}/>
{/if}