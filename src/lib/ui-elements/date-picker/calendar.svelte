<script>
	import { createEventDispatcher } from "svelte";
	import Calender from "./_calender.svelte";
	import Dropdown from "../dropdown2.svelte";
	import Icon from '../icon.svelte'
	import { getMonthName } from "./date-time.js";

	const dispatch = createEventDispatcher();

	// props
	export let isAllowed = () => true;
	export let selected = new Date();
	export let use_dropdown = true

	// state
	let date, month, year;

	// so that these change with props
	$: {
		date = selected.getDate();
		month = selected.getMonth();
		year = selected.getFullYear();
	}

	const next = () => {
		if (month === 11) {
			month = 0;
			year = year + 1;
			return;
		}
		month = month + 1;
	};

	const prev = () => {
		if (month === 0) {
			month = 11;
			year -= 1;
			return;
		}
		month -= 1;
	};

	const onDateChange = d => {
		dispatch("datechange", d.detail);
	};
</script>

<div class="bg-white">
	<div class="px-2 py-2 flex items-center">
		<div class="flex-1 px-2">{getMonthName(month)} {year}</div>
		<button class="focus:outline-none w-8 h-8 flex items-center justify-center bg-white border rounded-full" on:click|stopPropagation={prev}>
			<Icon name="right" className="rotate-180 transform w-4"/>
		</button>
		<button class="focus:outline-none w-8 h-8 flex items-center justify-center hover:bg-gray-100 rounded-full" on:click|stopPropagation={next}>
			<Icon name="right" className="w-4"/>
		</button>
	</div>
	<Calender
					{month}
					{year}
					date={selected}
					{isAllowed}
					on:datechange={onDateChange} />
</div>