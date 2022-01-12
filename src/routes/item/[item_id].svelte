<script context="module">
	import {http, onFail} from "$lib/http";

	export const load = async ({page, fetch}) => {
		const {data, success, debug} = await http.post(fetch, '/itemApi/get_by_ids', {
			ids: [page.params.item_id]
		})
		if (!success) return onFail(debug)
		return {
			props: {
				pdf_array: data[0].pdf_array
			}
		}
	}
</script>

<script>
	export let pdf_array
</script>

{#each pdf_array as src}
	<img {src} alt="yo">
{/each}