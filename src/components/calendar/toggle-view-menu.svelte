<script>
	import Dropdown from '../ui-elements/dropdown3.svelte'
	import dayjs from "dayjs";

	export let tutor_id
	export let active_menu

	let day_options = [
		{
			value: 0,
			label: 'Sunday'
		},
		{
			value: 1,
			label: 'Monday'
		},
		{
			value: 2,
			label: 'Tuesday'
		},
		{
			value: 3,
			label: 'Wednesday'
		},
		{
			value: 4,
			label: 'Thursday'
		},
		{
			value: 5,
			label: 'Friday'
		},
		{
			value: 6,
			label: 'Saturday'
		}
	]
</script>

<div class="inline-flex h-16 items-center text-gray-600">
	<div class="h-12 px-1 inline-flex items-center border border-gray-400 rounded">
		<a href="tutor/{tutor_id}/{dayjs().format('YYYY-MM')}" class="w-10 h-10 flex items-center justify-center {active_menu === 'month' ? 'bg-blue-100 text-blue-500' : ''}">
			<svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" viewBox="0 0 36 36" class="fill-current w-6"><path d="M31.5 0H36v36H0V0H31.5zM2.7 32.822h30.6V8.47H2.7v24.352z"></path><path d="M4.503 10.588h5.4v5.294h-5.4zM4 25v6h6v-6H4zm5 5H5v-4h4v4zM11 25v6h6v-6h-6zm5 5h-4v-4h4v4zM4 18v6h6v-6H4zm5 5H5v-4h4v4zM18 25v6h6v-6h-6zm5 5h-4v-4h4v4zM25 25v6h6v-6h-6zm5 5h-4v-4h4v4zM11 18v6h6v-6h-6zm5 5h-4v-4h4v4zM18 18v6h6v-6h-6zm5 5h-4v-4h4v4zM25 18v6h6v-6h-6zm5 5h-4v-4h4v4zM11 11v6h6v-6h-6zm5 5h-4v-4h4v4zM18 11v6h6v-6h-6zm5 5h-4v-4h4v4zM25 11v6h6v-6h-6zm5 5h-4v-4h4v4z"></path></svg>
		</a>
		<a href="tutor/{tutor_id}/schedule" class="w-10 h-10 flex items-center justify-center {active_menu === 'week' ? 'bg-blue-100 text-blue-500' : ''}">
			<svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" viewBox="0 0 36 36" class="fill-current w-6"><path d="M0 5v27h36V5H0zm11 24H3V11h8v18zm11 0h-8V11h8v18zm11 0h-8V11h8v18z"></path></svg>
		</a>
		<Dropdown>
			<a href="tutor/{tutor_id}/day/1" slot="activator" class="w-10 h-10 flex items-center justify-center {active_menu === 'day' ? 'bg-blue-100 text-blue-500' : ''}">
				<svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" viewBox="0 0 36 36" class="fill-current w-6"><path d="M34.752 2H0v32h36V2h-1.248zM2.5 31.458V6.736h31v24.722h-31z"></path><path d="M8.807 10.107H4.69v18.207h4.867V10.107M30.424 10.107h-4.117v18.207h4.867V10.107M23.414 10.107H11.598v18.207h12.566V10.107h-.75zm-.75 16.68H13.1V11.632h9.564v15.155z"></path></svg>
			</a>
			<div class="bg-white shadow-lg border border-gray-300">
				{#each day_options as option}
					<a href="tutor/{tutor_id}/day/{option.value}" class="block cursor-pointer px-4 py-2 hover:text-blue-500 hover:bg-gray-200">{option.label}</a>
				{/each}
			</div>
		</Dropdown>
	</div>
</div>
