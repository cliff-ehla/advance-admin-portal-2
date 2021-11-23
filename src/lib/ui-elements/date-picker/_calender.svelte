<script>
	import { getDateRows, uuid, noop } from "./date-time.js";
	import { createEventDispatcher } from "svelte";

	const dispatch = createEventDispatcher();

	// props
	export let date;
	export let month;
	export let year;
	export let isAllowed;

	// local vars to help in render
	const weekdays = ["S", "M", "T", "W", "T", "F", "S"];
	let cells;

	// function helpers
	const onChange = date => {
		dispatch("datechange", new Date(year, month, date));
	};

	const allow = (year, month, date) => {
		if (!date) return true;
		return isAllowed(new Date(year, month, date));
	};

	const isSelected = (value) => {
		return new Date(date.getFullYear(), date.getMonth(), date.getDate()).getTime() === new Date(year, month, value).getTime()
	}

	$: cells = getDateRows(month, year).map(c => ({
		value: c,
		allowed: allow(year, month, c)
	}));
</script>

<div class="w-72">
	<div class="flex px-1">
		{#each weekdays as day}
			<div class="w-8 h-8 rounded-full inline-flex items-center justify-center text-xs m-1">{day}</div>
		{/each}
	</div>

	<div class="flex flex-wrap px-1">
		{#each cells as { allowed, value } (uuid())}
			<div
				class="w-8 h-8 rounded-full inline-flex items-center justify-center text-xs m-1 {isSelected(value) ? 'bg-blue-500 text-white' : ''} {!allowed ? 'cursor-not-allowed text-gray-300' : (allowed && value) ? 'hover:bg-gray-100 cursor-pointer' : ''}"
				on:click={allowed && value ? onChange.bind(this, value) : noop}
				class:cell={true}>
				{value || ''}
			</div>
		{/each}
	</div>
</div>
