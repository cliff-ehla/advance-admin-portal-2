<script>
	import {notifications} from "$lib/store/notification";

	export let msg
	export let rows = 8
	let copy_text_el

	const onConfirmMessageClick = () => {
		copy_text_el.select()
		document.execCommand("copy")
		notifications.success('文字已複製')
	}
</script>

<div class="flex border border-gray-300 rounded">
	<textarea bind:this={copy_text_el} class="p-4 w-full" name="copy" cols="30" {rows} value={msg}></textarea>
	<button class="flex-shrink-0 bg-gray-100 cc px-1 text-sm border-l border-gray-300 hover:bg-blue-50" on:click={onConfirmMessageClick}>複製</button>
</div>