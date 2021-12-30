<script>
	import {http} from "../../helpers/http";
	import {student_store} from "../../store/student-store.js";

	export let zoom_id
	import {onMount} from 'svelte'
	import Preview from '$lib/student/student-preview.svelte'

	let students

	onMount(async () => {
		const {data} = await http.post('zoomApi/zoom_detail', {
			wrapper_id: zoom_id
		})
		students = data.students
		students = students.map(s => student_store.getStudent(s.user_id))
		students = students.filter(s => !!s)
	})
</script>

<div class="bg-white shadow-lg p-4">
	<b>Students</b>
	{#if students}
		{#each students as s}
			<Preview {s}/>
		{/each}
	{:else}
		loading...
	{/if}
</div>


