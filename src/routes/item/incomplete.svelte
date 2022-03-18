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
	import relativeTime from 'dayjs/plugin/relativeTime'
	dayjs.extend(relativeTime)
</script>

<div class="container py-4">
	{#each item_list as item}
		<div class="border border-gray-300 p-4 rounded my-2">
			<p>Item ID: {item.item_id}</p>
			<p>Class code: {item.class_code}</p>
			{#if item.c_description}
				<p>{item.c_description}</p>
			{/if}
			<p>Created {dayjs(item.update_ts).fromNow()}</p>
		</div>
	{/each}
</div>