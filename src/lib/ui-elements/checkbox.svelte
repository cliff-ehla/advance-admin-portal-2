<script>
	import Icon from '$lib/ui-elements/icon.svelte'
	export let checked
</script>

<div class="w-6 h-6 rounded cc border" class:unchecked={!checked} class:checked>
	<Icon name="tick" className="w-3 fill-current"/>
</div>

<style>
	.checked {
		@apply bg-green-500 text-white;
	}
	.unchecked {
		@apply bg-gray-200 text-white;
	}
</style>