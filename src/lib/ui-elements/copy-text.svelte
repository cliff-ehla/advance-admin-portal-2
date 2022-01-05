<script>
	import {notifications} from "$lib/store/notification";
	import Icon from '$lib/ui-elements/icon.svelte'

	export let value
	let copy_text_el

	const onConfirmMessageClick = () => {
		copy_text_el.select()
		document.execCommand("copy")
		notifications.success('文字已複製')
	}
</script>

<div class="flex border border-gray-300 rounded">
	<input bind:this={copy_text_el} class="p-1 w-full focus:outline-none" {value} readonly/>

	<button class="flex-shrink-0 bg-gray-100 cc px-1 text-sm border-l border-gray-300 hover:bg-blue-50" on:click={onConfirmMessageClick}>
		<Icon name="copy" className="w-3"/>
	</button>
</div>