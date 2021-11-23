<script>
	import { createEventDispatcher } from "svelte";
	import Calender from "./calendar.svelte";
	import Dropdown from "../dropdown2.svelte";

	const dispatch = createEventDispatcher();

	// props
	export let isAllowed = () => true;
	export let selected = new Date();

</script>

<Dropdown width_class={null}>
	<div class="whitespace-nowrap" slot="activator">
		{selected.toDateString()}
	</div>
	<Calender on:datechange {isAllowed} {selected}/>
</Dropdown>