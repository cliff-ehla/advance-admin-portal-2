<script>
	import {http} from "$lib/http";
	import {getContext} from 'svelte'
	const {openModal} = getContext('simple-modal')
	import CreateUserDialog from '$lib/student/create-new-user-dialog.svelte'
	import Icon from '$lib/ui-elements/icon.svelte'
	import {student_store} from "../../store/student-store";
	import Preview from '$lib/student/student-preview.svelte'

	export let student_list = []

	const onAdd = () => {
		openModal(CreateUserDialog, {
			onSuccess: async () => {
				const {data} = await http.get(fetch, '/adminApi/list_students_with_ticket_info')
				student_list = data
			}
		}, {
			padding: '1em'
		})
	}
</script>

<div class="p-4 bg-gray-50">
	{#each $student_store as s}
		<Preview {s}/>
	{/each}
</div>

<button class="fixed right-4 bottom-4 w-12 h-12 rounded-full flex items-center justify-center text-white bg-blue-500 hover:bg-blue-700"
        on:click={onAdd}>
	<Icon name="add"/>
</button>