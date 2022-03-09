<script context="module">
	import {http, onFail} from "$lib/http";

	export const load = async ({page, fetch}) => {
		const {data, success, debug} = await http.get(fetch, '/syllabusApi/list_syllabus_category')
		if (!success) return onFail(debug)
		return {
			props: {
				syllabus_list: data
			}
		}
	}
</script>

<script>
	export let syllabus_list
</script>

<div class="container py-4">
	{#each syllabus_list as s}
		<div class="p-4 my-2 border border-gray-200">
			<p>{s.sub_cat_hk}</p>
			<p class="text-gray-500 text-sm">{s.sub_cat_en}</p>
			<div class="mt-1">
				{#each s.levels as lv}
					<a href="/syllabus/{lv.syllabus_id}" class="mr-2 px-1 py-0.5 rounded text-sm text-gray-500 bg-gray-100 border border-gray-300 hover:text-blue-500 hover:bg-blue-50">{lv.level}</a>
				{/each}
			</div>
		</div>
	{/each}
</div>