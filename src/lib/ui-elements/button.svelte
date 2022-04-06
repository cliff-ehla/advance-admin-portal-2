<script>
	import {is_loading} from "$lib/store/is_loading";
	import Spinner from '$lib/ui-elements/spinner.svelte'
	export let disabled = false
	export let button_class = 'px-4 py-2'
	$: computed_disabled = disabled || $is_loading
</script>

<button
				on:click
				disabled={computed_disabled}
				class:active={!computed_disabled}
				class="{button_class} rounded relative transition-shadow transition-transform hover:shadow-lg transform hover:-translate-y-0.5 whitespace-nowrap">
	{#if $is_loading}
		<div class="absolute inset-0 cc">
			<Spinner/>
		</div>
	{/if}
	<div class:opacity-0={$is_loading}>
		<slot/>
	</div>
</button>

<style>
	[disabled] {
			@apply bg-gray-200 text-gray-400 cursor-not-allowed;
	}
	.active {
			@apply bg-gradient-to-b from-blue-500 to-blue-700 text-white;
	}
</style>