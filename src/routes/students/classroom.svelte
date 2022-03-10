<script>
	import {student_analytic} from "$lib/store/student-analytic.js";
	import Preview from '$lib/student/student-preview.svelte'
</script>

<div class="bg-gray-100 p-4">
	<p class="font-bold" style="font-size: 2em">大細班學生總數: {$student_analytic.total_students}</p>
</div>
<div class="flex bg-gray-100 p-4">
	<div class="p-4 bg-white">
		<p class="font-bold mb-4" style="font-size: 2em">大戶(需提醒續費): {$student_analytic.few_ticker_user.length}</p>
		{#each $student_analytic.few_ticker_user as s}
			<Preview {s}/>
		{/each}
		<p class="font-bold mb-4" style="font-size: 2em">新用戶: {$student_analytic.new_users.length}</p>
		{#each $student_analytic.new_users as s}
			<Preview {s}/>
		{/each}
	</div>
	<div class="p-4 bg-white ml-4">
		<p class="font-bold mb-4" style="font-size: 2em">大戶: {$student_analytic.many_ticker_user.length}</p>
		{#each $student_analytic.many_ticker_user as s}
			<Preview {s}/>
		{/each}
	</div>
</div>