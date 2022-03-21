<script context="module">
	import {http, onFail} from "$lib/http";

	export const load = async ({page, fetch}) => {
		const {data, success, debug} = await http.get(fetch, '/itemApi/list_all_empty_course_material')
		if (!success) return onFail(debug)
		return {
			props: {
				item_list: data
			}
		}
	}
</script>

<script>
	export let item_list
	import dayjs from "dayjs";
	import relativeTime from 'dayjs/plugin/relativeTime.js'
	dayjs.extend(relativeTime)
</script>

<div class="container py-4">
	<h1 class="mb-4 text-xl">Incomplete items</h1>
	<div class="grid grid-cols-3 gap-4">
		{#each item_list as item}
			<div class="border border-gray-300 rounded">
				<div class="overflow-hidden relative" style="padding-top: 56%">
					<img class="absolute inset-0" src={item.thumbnail_path} alt="hi">
				</div>
				<div class="p-4">
					<p>{item.name}</p>
					{#if item.start_date}
						<p class="text-sm text-blue-500">Lesson start <b>{dayjs(item.start_date).fromNow()}</b></p>
					{/if}
					<p class="text-sm text-gray-500">Item ID: {item.item_id}</p>
					<p class="text-sm text-gray-500">Class code: {item.class_code}</p>
				</div>
			</div>
		{/each}
	</div>
</div>