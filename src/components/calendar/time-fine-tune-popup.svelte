<script>
	import TimePicker from '../ui-elements/time-picker-2.svelte'
	import {getContext} from 'svelte'
	import dayjs from "dayjs";

	const {closePopper} = getContext('popper')

	export let start_time
	export let end_time
	export let duration = dayjs(`1970-01-01 ${end_time}:00`).diff(dayjs(`1970-01-01 ${start_time}:00`), 'minute')
	export let onConfirm = () => {}
	export let is_duration_control = true

	const onClick = () => {
		onConfirm({
			start_hh_mm: start_time,
			end_hh_mm: end_time
		})
		closePopper()
	}

	const onStartTimeInput = e => {
		start_time = e.detail
		if (is_duration_control) {
			end_time = dayjs(`1970-01-01 ${start_time}:00`).add(duration, 'minute').format('HH:mm')
		}
	}

	const onEndTimeInput = e => {
		end_time = e.detail
		if (is_duration_control) {
			start_time = dayjs(`1970-01-01 ${end_time}:00`).subtract(duration, 'minute').format('HH:mm')
		}
	}

	const onDurationInput = e => {
		duration = e.target.value
		end_time = dayjs(`1970-01-01 ${start_time}:00`).add(duration, 'minute').format('HH:mm')
	}
</script>

<div class="{is_duration_control ? 'shadow-lg bg-white border border-gray-300 rounded px-2 py-1' : ''}">
	{#if is_duration_control}
		<div class="bg-blue-100 text-blue-500 font-bold text-center py-1 mb-1" style="font-size: 11px">
			Duration:
			<input on:input={onDurationInput} class="w-16 mx-0.5 text-center" bind:value={duration} type="text">
			min
		</div>
	{/if}
	<div class="flex">
		<div>
			<p class="font-bold" style="font-size: 11px">Start</p>
			<TimePicker hh_mm={start_time} on:input={onStartTimeInput}/>
		</div>
		<div class="ml-1">
			<p class="font-bold" style="font-size: 11px">End</p>
			<TimePicker hh_mm={end_time} on:input={onEndTimeInput}/>
		</div>
		<button on:click={onClick} class="ml-1 bg-blue-500 text-white px-2 mt-4 rounded text-xs">OK</button>
	</div>
</div>