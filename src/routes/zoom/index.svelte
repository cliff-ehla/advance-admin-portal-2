<script>
	import {http} from "$lib/http.js";
	import dayjs from "dayjs";
	import utc from "dayjs/plugin/utc.js";
	dayjs.extend(utc)

	let zoom_id
	let result
	let map = {
		BIG: 20,
		SMALL: 4,
		UNLIMITED: 9999
	}
	import Button from '$lib/ui-elements/button.svelte'

	const onClick = async () => {
		let {data, success} = await http.post(fetch, '/zoomApi/zoom_detail', {
			wrapper_id: zoom_id
		})
		if (success) {
			result = data
		}
	}
</script>

<div class="p-4">
	<p>Search</p>
	<input class="input" bind:value={zoom_id} type="text">
	<Button on:click={onClick}>Search</Button>

	{#if result}
		<div class="p-4">
			<p class="text-blue-500">{dayjs.utc(result.start_date).local().format('DD MMM YYYY h:mma')}</p>

			<div class="my-4">
				<p>{result.sub_cat_hk}</p>
				<p class="text-sm">{result.title}</p>
			</div>

			<p>能力程度: {result.rc_type}</p>

			<p>課時: {result.duration} 分鐘</p>

			<p>老師: {result.nickname}</p>

			<div class="bg-gray-200 text-xs rounded px-2 inline-block">{result.big_classroom_type}</div>

			<div class="bg-gray-50 rounded p-4 my-2">
				<p class="text-gray-500 text-sm">Registered students: {result.students.length} / {map[result.big_classroom_type]}</p>
				{#each result.students as s}
					<p>{s.nickname}</p>
				{/each}
			</div>

			<div class="mt-4 text-sm text-gray-500">{result.description_hk}</div>
		</div>
	{/if}
</div>