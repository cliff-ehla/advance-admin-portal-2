<script>
	import {fly} from 'svelte/transition'
	import {setContext} from 'svelte'
	import Icon from '../../components/ui-elements/icon.svelte'
	let shown = false
	let msg = ''
	let timer_id
	setContext('notification', {showNotification})
	function showNotification (_msg) {
		shown = true
		msg = _msg
		timer_id = setTimeout(() => {
			shown = false
		}, 5000)
	}

	function close () {
		shown = false
		if (timer_id) clearTimeout(timer_id)
	}
</script>

{#if shown}
	<div transition:fly={{duration: 500, y: 20}}
	     class="h-12 pl-4 inline-flex items-center z-50 fixed left-1/2 top-16 transform -translate-x-1/2 bg-white rounded shadow-lg">
		<div class="absolute inset-y-0 left-0 bg-green-500 w-1.5"></div>
		<div class="flex-shrink-0 w-6 h-6 rounded-full bg-green-500 text-white flex justify-center items-center">
			<Icon name="tick" className="w-3"/>
		</div>
		<div class="mx-4 leading-tight">{msg}</div>
		<button on:click={close} class="w-8 h-8 flex items-center justify-center">
			<Icon name="close" className="w-2"/>
		</button>
	</div>
{/if}

<slot/>