<script>
	import {http} from "../../helpers/http";

	export let zoom_id
	import {onMount} from 'svelte'

	let students

	onMount(async () => {
		const {data} = await http.post('zoomApi/zoom_detail', {
			wrapper_id: zoom_id
		})
		students = data.students
	})
</script>

<div class="bg-white shadow-lg p-4">
	<b>Students</b>
	{#if students}
		{#each students as s}
			<p>{s.nickname}</p>
		{/each}
	{:else}
		loading...
	{/if}
</div>


