<script>
	export let tutor_id
	import {onMount, getContext} from 'svelte'
	import {fetchStudentList} from "../../store/org-api";
	const {closeModal} = getContext('simple-modal')

	let student_list

	onMount(async  () => {
		student_list = await fetchStudentList({
			tutor_id
		})
	})
</script>

<div class="p-4 bg-gray-50">
	{#if student_list}
		{#each student_list as s}
			<a on:click={closeModal} class="block p-4 bg-white mb-2 rounded shadow hover:text-blue-500" href="/students/{s.user_id}/tutor-group">
				<p class="font-bold">{s.nickname} ({s.level})</p>
				<p class="text-sm text-gray-500">{s.username} {s.user_id}</p>
			</a>
		{/each}
	{/if}
</div>