<script>
	export let message
	import {getContext} from 'svelte'
	const {closeModal} = getContext('simple-modal')

	let copy_text_el

	const onConfirmMessageClick = () => {
		copy_text_el.select()
		document.execCommand("copy");
		closeModal()
	}
</script>

<div class="w-96 shadow-lg border border-gray-300 bg-white p-4 rounded">
	<p class="mb-4 font-bold">Confirm message</p>
	<textarea bind:this={copy_text_el} bind:value={message} cols="30" rows="10"></textarea>
	<div class="mt-4">
		<button class="bg-green-500 text-white rounded-full px-8 py-2 hover:bg-green-700" on:click={onConfirmMessageClick}>Copy and confirm</button>
	</div>
</div>