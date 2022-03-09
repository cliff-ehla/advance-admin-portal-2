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
	console.log('cliff: ', syllabus_list)
</script>

{#each syllabus_list as s}
	<div class="p-4 my-1 border border-gray-200">
		<p>{s.sub_cat_hk}</p>
		<p>{s.sub_cat_en}</p>
		{#each s.levels as lv}
			<a href="/syllabus/{lv.syllabus_id}" class="mx-2 px-1 rounded text-sm bg-gray-200">{lv.level}</a>
		{/each}
	</div>
{/each}