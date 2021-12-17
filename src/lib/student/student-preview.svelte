<script>
	export let s
	import Icon from '$lib/ui-elements/icon.svelte'
</script>

<div class="flex items-center mb-4">
	<a href="/students/{s.student_id}/tutor-group" class="flex items-center px-2 py-1 leading-tight rounded-full border border-gray-400 hover:border-blue-500 hover:bg-gray-200">
		{#if s.gender === 'm'}
			<img src="/student-m-icon.png" alt="student" class="w-8 h-8 rounded-full">
		{:else if s.gender === 'f'}
			<img src="/student-f-icon.jpg" alt="student" class="w-8 h-8 rounded-full">
		{/if}
		<div class="ml-2">
			<p class="font-bold flex items-center">{s.student_nickname} <span class="text-xs bg-gray-100 border border-gray-300 px-0.5 ml-1 text-gray-500">{s.level}</span></p>
			<p class="text-xs text-gray-500">@{s.student_username} <span class="ml-1">ID:{s.student_id}</span></p>
		</div>
	</a>
	<div class="h-0.5 bg-gray-400 w-8"></div>
	<div>
		<div class="flex items-center leading-tight rounded-full border border-gray-400 hover:border-blue-500">
			<div class="flex items-center px-2 py-1">
				<img src="/parent-icon.png" alt="parent" class="w-8 h-8 rounded-full">
				<div class="ml-1">
					<p class="font-bold">{s.parent_nickname}</p>
					<p class="text-xs text-gray-500">@{s.parent_username}</p>
				</div>
			</div>
			<div class="px-2 py-1 ml-2 border-l border-gray-400">
				<div class="flex items-center">
					<img src="/ticket.jpg" alt="ticket" class="w-6 h-6 rounded-full">
					<p class="ml-1">{s.r_t_amt}張</p>

				</div>
				<p class="text-xs text-gray-500 mt-0.5">已用: {s.used_t_amt}, 總共: {s.tt_t_amt}</p>
			</div>
		</div>
	</div>
</div>