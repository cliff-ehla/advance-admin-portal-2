<script>
	import {createEventDispatcher} from 'svelte'
	import Dropdown from './dropdown3.svelte'
	const dispatch = createEventDispatcher()

	export let value = undefined
	export let options = []
	export let label_key = 'label'
	export let value_key = 'value'
	export let placeholder = 'Type something here...'

	const onSelect = (option) => {
		value = option[value_key]
		dispatch('input', value)
	}

	const onInput = (e) => {
		dispatch('input', e.target.value)
	}
</script>

<div class="relative border border-gray-300 rounded bg-white pr-4">
	<Dropdown full_width caveat_visible activator_active_style="bg-transparent" open_on_hover={false}>
		<input slot="activator" id="template-text-box" on:input={onInput} {placeholder} class="focus:outline-none px-4 py-2 pr-2 w-full" bind:value={value}/>
		<div class="bg-white rounded border border-gray-300 shadow-lg max-h-80 overflow-y-scroll">
			{#each options as option}
				<div on:click={() => {onSelect(option)}} class="px-4 py-2 hover:bg-gray-100 hover:text-blue-500 cursor-pointer border-b border-gray-300">
					<p>{option[label_key]}</p>
				</div>
			{/each}
		</div>
	</Dropdown>

</div>