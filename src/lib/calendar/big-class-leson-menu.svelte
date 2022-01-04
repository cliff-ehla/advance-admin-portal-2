<script>
	import {http} from "$lib/http.js";
	import {student_store} from "../../store/student-store.js";

	export let zoom_id
	export let tutor_group_id
	import {onMount} from 'svelte'
	import Preview from '$lib/student/student-preview.svelte'

	let students

	onMount(async () => {
		const {data} = await http.post(fetch, '/zoomApi/zoom_detail', {
			wrapper_id: zoom_id
		})
		students = data.students
		students = students.map(s => student_store.getStudent(s.user_id))
		students = students.filter(s => !!s)
	})

	const onReg = () => {
		http.post(fetch, '/courseApi/reg_registrable_classroom', {
			tutor_group_id,
			child_id: '29935'
		}, {
			notification: 'Reg ed'
		})
	}
</script>

<div class="bg-white shadow-lg p-4">
	<button on:click={onReg}>Reg</button>
	<b>Students</b>
	{#if students}
		{#each students as s}
			<Preview {s}/>
		{/each}
	{:else}
		loading...
	{/if}
</div>


