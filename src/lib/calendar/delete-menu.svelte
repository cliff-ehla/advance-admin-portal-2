<script>
	export let onDelete = () => {}
</script>

<div class="shadow-lg bg-white border border-gray-300 rounded px-2 py-1">
	<div on:click={onDelete} class="cursor-pointer text-sm px-4 py-2 flex hover:bg-gray-100 hover:text-blue-500">
		Delete
	</div>
</div>