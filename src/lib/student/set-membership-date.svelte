<script>
	import Datepicker from '$lib/ui-elements/date-picker/index.svelte'
	import Button from '$lib/ui-elements/button.svelte'
	import dayjs from "dayjs";
	import {capitalize} from "$lib/helper/capitalize.js";

	export let start_date
	export let end_date
	export let type
	export let user_id
	export let nickname
	const onDateChange = (e) => {
		start_date = dayjs(e.detail).format('YYYY-MM-DD')
	}
	const onDateChangeEnd = (e) => {
		end_date = dayjs(e.detail).format('YYYY-MM-DD')
	}
	const onClick = () => {
		console.log('cliff: ', start_date)
	}
</script>

<p class="text-gray-600 mb-6">{capitalize(type)} membership for {nickname}</p>
<div class="flex mt-4 mb-4">
	<div>
		<p class="text-sm text-gray-500">Start date</p>
		<Datepicker selected={dayjs(start_date).toDate()} on:datechange={onDateChange}/>
	</div>
	<div class="ml-4">
		<p class="text-sm text-gray-500">End date</p>
		<Datepicker selected={dayjs(end_date).toDate()} on:datechange={onDateChangeEnd}/>
	</div>
</div>

<div class="flex justify-end">
	<Button on:click={onClick}>Confirm</Button>
</div>