<script>
	import {createPopper} from '@popperjs/core'
	import {onMount, createEventDispatcher} from 'svelte'
	const dispatch = createEventDispatcher()

	export let placement = 'bottom'
	export let offset = 4
	export let caveat_visible = false
	export let delay = 100
	export let activator_active_style = 'bg-gray-100'
	export let activator_style = ''
	export let open_on_hover = true
	export let full_width = false

	let popup_el
	let activator_el
	let popper_instance
	let active
	let timeout_id

	const onToggle = (e) => {
		if (!popup_el) return
		const is_hidden = popup_el.classList.contains('hidden')
		if (is_hidden) show()
		else hide()
	}

	const hide = () => {
		if (!popup_el) return
		popup_el.classList.add('hidden')
		active = false
		dispatch('hide')
	}

	const show = () => {
		if (!popup_el) return
		popup_el.classList.remove('hidden')
		popper_instance.update()
		active = true
		dispatch('show')
	}

	const onWindowClick = (e) => {
		let popup = e.target.closest('.popup')
		let activator = e.target.closest('.activator')
		if (!activator) hide()
	}

	const onMouseLeave = () => {
		if (!open_on_hover) return
		timeout_id = setTimeout(hide, delay)
	}

	const onMouseEnter = () => {
		if (!open_on_hover) return
		if (timeout_id) clearTimeout(timeout_id)
		show()
	}

	onMount(() => {
		popper_instance = createPopper(activator_el, popup_el, {
			placement,
			modifiers: [
				{
					name: 'offset',
					options: {
						offset: [0, offset],
					},
				},
			],
		})
	})
</script>

<div class:w-full={full_width} on:mouseenter={onMouseEnter} on:mouseleave={onMouseLeave}>
	<div bind:this={activator_el} on:mouseenter={onMouseEnter} on:click={onToggle}
	     class="inline-block activator cursor-pointer flex items-center {activator_style} {active ? activator_active_style : ''}">
		<slot name="activator"/>
		{#if caveat_visible}
			<svg viewBox="0 0 36.001 36" class:rotate-180={active}
			     class="transition transition-transform transform w-3 ml-2 svgicon center-block replaced-svg fill-current">
				<path d="M32.914 8.443L18.004 21.32 3.078 8.443 0 12.013l18.004 15.542L36 12.015"></path>
			</svg>
		{/if}
	</div>

	<div bind:this={popup_el} class="hidden popup" style="z-index: 9999">
		<slot/>
	</div>
</div>

<svelte:window on:click={onWindowClick}/>