<script>
	import {getContext} from 'svelte'
	const {closeModal} = getContext('simple-modal')

	export let text
	export let placeholder = '請輸入信息'
	export let onConfirm = () => {}

	const onConfirmClick = () => {
		onConfirm(text)
		closeModal()
	}
</script>

<p>{placeholder}:</p>
<textarea rows="4" bind:value={text} class="w-96 px-2 py-4 border border-gray-300 rounded my-4" {placeholder}/>

<div class="flex">
	<button on:click={closeModal} class="flex-1 text-gray-500 border border-gray-200 hover:bg-gray-100 hover:text-blue-500 rounded px-4 py-2">Cancel</button>
	<button on:click={onConfirmClick} class="flex-1 bg-blue-500 hover:bg-blue-700 text-white rounded px-4 py-2 ml-4">Save</button>
</div>