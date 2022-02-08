<script context="module">
	import {http, onFail} from "$lib/http";

	export const load = async ({page, fetch}) => {
		if (page.query.get('reload')) {}
		const {data, success, debug} = await http.post(fetch, '/classroomApi/list_tutor_classroom', {
			teacher_id: page.params.user_id
		})
		if (!success) return onFail(debug)
		return {
			props: {
				classroom_list: data
			}
		}
	}
</script>

<script>
	export let classroom_list = []
	import {getContext} from 'svelte'
	const {openModal, closeModal} = getContext('simple-modal')
	import CreateTutorClassroom from '$lib/classroom/create-tutor-classroom.svelte'
	import {page} from "$app/stores";

	const onCreate = () => {
		openModal(CreateTutorClassroom, {
			teacher_id: $page.params.user_id
		}, {
			overflow: 'initial',
			width: '600px'
		})
	}
</script>

{#if classroom_list.length}
	{#each classroom_list as classroom}
		<div class="p-4">
			<p>{classroom.title}</p>
			<p>{classroom.syllabus_id}</p>
		</div>
	{/each}
{:else}
	no data
{/if}

<button class="button" on:click={onCreate}>Create</button>