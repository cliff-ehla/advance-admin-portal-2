<script>
	import {student_store} from "../../store/student-store";
</script>

<div class="p-4 bg-gray-50">
	{#if $student_store}
		{#each $student_store as s}
			<a class="block p-4 bg-white mb-2 rounded shadow hover:text-blue-500" href="/students/{s.user_id}/tutor-group">
				<p class="font-bold">{s.nickname} ({s.level})</p>
				<p class="text-sm text-gray-500">{s.username} {s.user_id}</p>
			</a>
		{/each}
	{/if}
</div>