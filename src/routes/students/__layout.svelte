<script>
	import {student_store} from "../../store/student-store";
</script>

<div class="flex">
	<div style="height: calc(100vh - 3em)" class="w-40 max-h-full overflow-y-scroll bg-gray-100 flex flex-col">
		<div class="h-16 flex items-center font-bold px-4 border-b border-gray-300">
			Students
		</div>
		<div class="flex-1 border-r border-gray-200">
			{#if $student_store}
				{#each $student_store as s}
					<a class="block px-4 py-2 bg-white border-b border-gray-200 hover:text-blue-500" href="/students/{s.user_id}/tutor-group">
						<p class="font-bold">{s.nickname} ({s.level})</p>
					</a>
				{/each}
			{/if}
		</div>
	</div>
	<div style="height: calc(100vh - 3em)" class="overflow-y-scroll flex-1">
		<slot/>
	</div>
</div>