<script>
	import {onMount} from 'svelte'
	import {listNearlyCompleteTutorGroup} from "../../api/admin-api";

	let list

	onMount(async () => {
		list = await listNearlyCompleteTutorGroup()
	})
</script>

{#if list}
	<table>
		{#if list.length}
			<tr>
				<td>Student name</td>
				<td>Course title</td>
				<td>Complete count</td>
				<td>Last lesson</td>
			</tr>
			{#each list as item}
				<tr>
					<td>{item.nicknames}</td>
					<td>{item.title}</td>
					<td>{item.actual_zoom_cnt} / {item.zoom_cnt}</td>
					<td>{item.last_lesson}</td>
				</tr>
			{/each}
		{/if}
	</table>
{/if}

<style>
    td {
        padding: 1em;
    }
</style>