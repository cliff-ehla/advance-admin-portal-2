<script>
	import {listWhatsappMessage} from "../../api/message-api";

	export let wrapper_id
	import {onMount} from 'svelte'

	let messages

	onMount(async () => {
		messages = await listWhatsappMessage({
			wrapper_id
		})
	})
</script>

{#if messages}
	{#each messages as m}
		<div class="p-4 border border-gray-200 p-4 mb-2">
			{@html m.msg}
		</div>
	{/each}
{/if}