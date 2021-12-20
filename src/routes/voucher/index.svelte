<script>
	import Icon from '$lib/ui-elements/icon.svelte'
	import CreateVoucher from "$lib/voucher/create-voucher.svelte";
	import {getContext} from 'svelte'
	const {openModal, closeModal} = getContext('simple-modal')

	const onAdd = () => {
		openModal(CreateVoucher, {}, {
			padding: '1em'
		})
	}
</script>

<button class="fixed right-4 bottom-4 w-12 h-12 rounded-full flex items-center justify-center text-white bg-blue-500 hover:bg-blue-700"
        on:click={onAdd}>
	<Icon name="add"/>
</button>