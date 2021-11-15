<script>
	import TimePicker from '../ui-elements/time-picker.svelte'
	import dayjs from "dayjs";

	export let start_time
	export let end_time
	export let onConfirm = () => {}

	const onConfirmClick = () => {
		onConfirm(start_time, end_time)
	}

	let date_display = dayjs(start_time).format('DD MMM')
	let start_time_string = dayjs(start_time).format('HH:mm:00')
	let end_time_string = dayjs(end_time).format('HH:mm:00')
</script>

<div class="bg-white rounded p-4 shadow-lg w-72">
	<p class="font-bold text-lg mb-4">Create reservation</p>
	<div class="flex mb-2">
		<div class="w-12"></div>
		<div class="flex-1">Teacher name</div>
	</div>
	<div class="flex mb-2">
		<div class="w-12">Date</div>
		<div class="flex-1">{date_display}</div>
	</div>
	<div class="flex mb-2">
		<div class="w-12">Time</div>
		<div class="flex-1">
			<div class="w-10">
				<p>Start</p>
				<TimePicker on:input={e => {start_time_string = e.detail}} {start_time_string}/>
			</div>
			<div class="w-10">
				<p>End</p>
				<TimePicker on:input={e => {end_time_string = e.detail}} start_time_string={end_time_string}/>
			</div>
		</div>
	</div>
	<button on:click={onConfirmClick} class="mt-4 rounded-full w-full py-2 bg-blue-500 text-white cursor-pointer">
		Confirm
	</button>
</div>