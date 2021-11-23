<script>
	import {createPopper} from '@popperjs/core'
	import {tick, setContext} from 'svelte'
	import {fade} from 'svelte/transition'

	let props
	let component
	let tooltip_el

	const delay = async (duration) => {
		return new Promise(resolve => {
			setTimeout(resolve, duration)
		})
	}

	const openPopper = async (base_el, new_component, new_props, new_config) => {
		if (component) {
			close()
			await delay(250)
		}
		component = new_component
		props = new_props || {}
		new_config = new_config || {}

		let persistent_content = new_config.persistent_content || false
		let persistent = new_config.persistent || false

		let placement = new_config.placement || 'bottom'
		let offset = new_config.offset || 0
		let config = {
			placement,
			modifiers: [
				{
					name: 'offset',
					options: {
						offset: [0, offset],
					},
				},
			]
		}

		await tick()
		createPopper(base_el, tooltip_el, config)

		if (persistent) {
			// do nothing
		} else if (persistent_content) {
			setTimeout(() => {
				window.addEventListener('click', e => {
					if (!e.target.closest('#tooltip')) {
						close()
					}
				}, {once: true})
			})
		} else {
			setTimeout(() => {
				window.addEventListener('click', close, {once: true})
			})
		}
	}

	const close = () => {
		component = null
		props = null
	}

	setContext('popper', {
		openPopper,
		closePopper: close
	})
</script>

{#if component}
	<div transition:fade={{duration: 200}} class="fixed inset-0 z-50 bg-black bg-opacity-20"></div>
	<div transition:fade={{duration: 200}} style="z-index: 99999" id="tooltip" bind:this={tooltip_el}>
		<svelte:component this={component} {...props}/>
	</div>
{/if}

<slot></slot>
