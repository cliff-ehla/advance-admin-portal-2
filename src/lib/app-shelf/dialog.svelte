<script>
	import {dialog} from "$lib/store/dialog";
	import { fly, fade } from "svelte/transition";
	import Button from '$lib/ui-elements/button.svelte'

	const onConfirm = async () => {
		await $dialog.onConfirm()
		$dialog.onSuccess()
		dialog.close()
	}
</script>

{#if $dialog.visible}
	<div transition:fade={{duration: 300}} class="fixed bg-black inset-0 bg-opacity-50 z-40"></div>
{/if}

{#if $dialog.visible}
	<div transition:fly={{ y: 100, duration: 200 }} class="z-50 bg-white fixed top-1/2 left-1/2 transform -translate-y-1/2 -ml-48 rounded-lg shadow-lg w-72">
		<div class="p-4 text-center">
			<div class="w-24 h-32 mx-auto">
				<img src="/confirm-dialog-icon.png" class="w-24 mx-auto" alt="confirm">
			</div>
			<p class="font-bold my-2">{$dialog.title}</p>
			<p>{$dialog.message}</p>
		</div>
		<div class="flex justify-between p-4">
			<button class="flex-1 bg-gray-100 hover:border-gray-400 border border-gray-200 rounded px-1 py-1" on:click={() => {dialog.close()}}>Cancel</button>
			<Button button_class="flex-1 py-2 ml-4" on:click={onConfirm}>確定</Button>
		</div>
	</div>

{/if}