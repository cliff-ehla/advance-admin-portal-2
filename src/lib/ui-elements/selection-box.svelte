<script>
	import {createEventDispatcher} from 'svelte'
	import Dropdown from './dropdown3.svelte'
	export let options
	export let selected_value
	export let caveat_visible = true
	export let dropdown_class = undefined
	export let placeholder = 'Select an option'
	export let value_key = 'value'
	export let label_key = 'label'
	export let label_key_2 = ''
	export let image_key = 'image'
	export let subtitle_key = ''
	export let disabled = false
	export let simple_array = false
	const dispatch = createEventDispatcher()
	$: selected_option = Array.isArray(options) ? options.find(opt => opt[value_key] == selected_value) : null
	$: selected_label = simple_array ? selected_value : selected_option ? selected_option[label_key] : null
	let dropdown_menu_width
	const scrollTo = (node, v) => {
		if (v == selected_option) {
			node.scrollIntoView()
		}
	}
	const onOptionClick = (option) => {
		if (disabled) return
		if (simple_array) {
			dispatch('input', option)
		} else {
			console.log(option[value_key])
			dispatch('input', option[value_key])
		}
	}

	const setWidth = node => {
		dropdown_menu_width = node.clientWidth
	}
</script>

<Dropdown full_width {caveat_visible} open_on_hover={false} offset={0} placement="bottom-start" activator_style="bg-white border border-gray-300 rounded px-4 py-3 w-full">
	<div use:setWidth slot="activator" class="flex items-center whitespace-nowrap w-full" class:opacity-40={!selected_label} class:cursor-not-allowed={disabled}>
		{#if selected_label}
			{#if simple_array}
				{selected_value}
			{:else}
				{#if selected_option[image_key]}
					<img src={selected_option[image_key]} alt="hi" class="w-8 h-8 rounded-full mr-2 flex-shrink-0">
				{/if}
				<div class="leading-none">{selected_label}</div>
			{/if}
		{:else}
			{placeholder}
		{/if}
	</div>
	<div style="width: {dropdown_menu_width}px" class="p-2 bg-white shadow-lg border border-gray-300 rounded max-h-80 overflow-y-scroll">
		{#if options.length}
			{#each options as opt}
				<div use:scrollTo={opt} on:click={onOptionClick(opt)} class="{opt == selected_option ? 'bg-gray-200 text-blue-500' : ''} py-2 flex items-center px-4 cursor-pointer hover:bg-gray-100 border-b border-gray-200">
					{#if simple_array}
						<div>{opt}</div>
					{:else}
						{#if opt[image_key]}
							<img src={opt[image_key]} alt="hi" class="w-8 h-8 rounded-full mr-2 flex-shrink-0">
						{/if}
						<div class:ml-2={opt[image_key]}>
							<div class="leading-none">
								{opt[label_key]}
								{#if opt[label_key_2]}
									({opt[label_key_2]})
								{/if}
							</div>
							{#if subtitle_key && opt[subtitle_key]}
								<p class="text-sm text-gray-500">
									{opt[subtitle_key]}
								</p>
							{/if}
						</div>
					{/if}
				</div>
			{/each}
		{:else}
			<p class="p-4 text-gray-400">No options</p>
		{/if}
	</div>
</Dropdown>
