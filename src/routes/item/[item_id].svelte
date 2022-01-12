<script context="module">
	import {http, onFail} from "$lib/http";

	export const load = async ({page, fetch}) => {
		const {data, success, debug} = await http.post(fetch, '/itemApi/get_by_ids', {
			ids: [page.params.item_id]
		})
		if (!success) return onFail(debug)
		return {
			props: {
				pdf_array: data[0].pdf_array,
				ppt_link: data[0].ppt_link
			}
		}
	}
</script>

<script>
	export let ppt_link
	export let pdf_array
</script>

{#if ppt_link}
	PPT link: <a href={ppt_link}>{ppt_link}</a>
{:else}
	{#each pdf_array as src}
		<img {src} alt="yo">
	{/each}
{/if}