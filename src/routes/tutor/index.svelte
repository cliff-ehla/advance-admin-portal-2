<script>
	import {fetchTeacherList} from "../../store/org-api";
	import {onMount} from 'svelte'
	import {tutor_store} from "../../store/tutor-store";
	import dayjs from "dayjs";

	let YYYY_MM

	onMount(() => {
		fetchTeacherList()
		YYYY_MM = dayjs().format('YYYY-MM')
	})
</script>

<div class="p-4 bg-gray-100">
	<p class="font-bold mb-4">Select a teacher to view their schedule</p>
	<div class="grid grid-cols-3 gap-4">
		{#if $tutor_store && $tutor_store.length}
			{#each $tutor_store as tutor}
				<a class="block p-4 hover:bg-gray-200 bg-white rounded" href="tutor/{tutor.user_id}/{YYYY_MM}">{tutor.nickname || tutor.username}</a>
			{/each}
		{/if}
	</div>
</div>