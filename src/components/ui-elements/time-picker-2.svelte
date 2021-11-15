<script>
	import dayjs from "dayjs";
	import {createEventDispatcher} from 'svelte'

	const dispatch = createEventDispatcher()

	export let hh_mm = '13:00'

	const onBlur = e => {
		let result = dayjs('1970-00-00 ' + e.target.value).format('HH:mm')
		hh_mm = result
		dispatch('input', hh_mm)
		dispatch('hide-overlay')
	}

	const onFocus = e => {
		dispatch('show-overlay')
	}
</script>

<input class="text-sm w-20 px-2 py-1 border border-gray-300 bg-gray-100" type="text" value={hh_mm} on:focus={onFocus} on:blur={onBlur}>