<script>
	import { flip } from "svelte/animate";
	import { fly } from "svelte/transition";
	import { notifications } from '$lib/store/notification';

	export let themes = {
		alert: "bg-red-500",
		success: "bg-green-500",
		info: "bg-yellow-500"
	};
</script>

<div class="fixed bottom-0 left-1/2 transform -translate-x-1/2 z-50 flex flex-col items-center" style="z-index: 9999">
	{#each $notifications as notification (notification.id)}
		<div
						animate:flip
						class="mb-1 flex-shrink-0 text-white shadow-lg {themes[notification.type]}"
						transition:fly={{ y: 30 }}
		>
			<div class="px-4 py-2">{notification.message}</div>
		</div>
	{/each}
</div>