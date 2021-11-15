<script>
	export let onDelete = () => {}
	export let onConfirm = () => {}
	export let start_time
	export let end_time
	import FineTuneTime from './time-fine-tune-popup.svelte'
</script>

<div class="shadow-lg bg-white border border-gray-300 rounded p-4">
	<FineTuneTime {onConfirm} {start_time} {end_time} is_duration_control={false}/>
	<div on:click={onDelete} class="cursor-pointer text-sm px-4 py-2 text-center flex bg-red-50 text-red-500 hover:bg-red-500 hover:text-white font-bold rounded mt-4">
		Delete time slot
	</div>
</div>