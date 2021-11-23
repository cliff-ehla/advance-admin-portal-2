<script>
	import {opened_dropdown_id} from "../../store/dropdown-store";
	import Icon from './icon.svelte'

	export let width_class = 'w-56'
	export let caveat_visible = true
	export let disabled = false

	const dropdown_id = Math.random()
	$: opened = $opened_dropdown_id === dropdown_id

	const onClick = () => {
		if (disabled) return
		opened_dropdown_id.set(dropdown_id)
	}
</script>

<div class="relative">
	<div on:click|stopPropagation={onClick} class="h-8 px-2 inline-flex items-center bg-white border border-gray-300 {disabled ? '' : 'cursor-pointer hover:border-blue-500'}" class:bg-gray-300={opened}>
		<div class="flex items-center">
			<slot name="activator"/>
			{#if caveat_visible && !disabled}
				<Icon name="right" className="w-2 transform transition-transform ml-2 {opened ? '-rotate-90' : 'rotate-90'}"/>
			{/if}
		</div>
	</div>
	{#if opened}
		<div class="absolute z-50 top-10 -left-2 {width_class} max-h-80 overflow-y-scroll shadow-lg rounded border border-gray-100 bg-white">
			<slot/>
		</div>
	{/if}
</div>

<svelte:window on:click={() => {opened_dropdown_id.set(null)}}/>
