<script>
	import {dialog} from "$lib/store/dialog";
	import { fly, fade } from "svelte/transition";
	import Button from '$lib/ui-elements/button.svelte'

	let checked = false
	let textarea_el

	const onConfirm = async () => {
		let text_input = textarea_el ? textarea_el.value : null
		await $dialog.onConfirm({checked, text_input})
		$dialog.onSuccess({checked, text_input})
		dialog.close()
	}
</script>

{#if $dialog.visible}
	<div transition:fade={{duration: 300}} class="fixed bg-black inset-0 bg-opacity-50 z-40"></div>
{/if}

{#if $dialog.visible}
	<div transition:fly={{ y: 100, duration: 200 }} class="z-50 bg-white fixed top-1/2 left-1/2 transform -translate-y-1/2 -translate-x-1/2 rounded-lg shadow-lg w-72">
		<div class="p-4 text-center">
			<div class="w-24 h-32 mx-auto">
				<img src="/confirm-dialog-icon.png" class="w-24 mx-auto" alt="confirm">
			</div>
			<p class="font-bold my-2">{$dialog.title}</p>
			{#if $dialog.message}
				<p>{$dialog.message}</p>
			{/if}
		</div>
		{#if $dialog.checkbox}
			<div class="mb-2 flex items-center justify-center">
				<input type="checkbox" bind:checked={checked} id="extra_option" class="cursor-pointer">
				<label for="extra_option" class="cursor-pointer ml-2">{$dialog.checkbox}</label>
			</div>
		{/if}
		{#if $dialog.text_input}
			<div class="mb-2 px-4">
				<textarea class="input w-full"
				          bind:this={textarea_el}
				          placeholder="{$dialog.text_input.placeholder}">{$dialog.text_input.value}</textarea>
			</div>
		{/if}
		<div class="flex justify-between p-4">
			<button class="flex-1 bg-gray-100 hover:border-gray-400 border border-gray-200 rounded px-1 py-1" on:click={() => {dialog.close()}}>取消</button>
			<Button button_class="flex-1 py-2 ml-4" on:click={onConfirm}>確定</Button>
		</div>
	</div>

{/if}