<script>
	import {http} from "$lib/http";
	import {getContext} from 'svelte'
	const {openModal} = getContext('simple-modal')
	import CreateUserDialog from '$lib/student/create-new-user-dialog.svelte'
	import Icon from '$lib/ui-elements/icon.svelte'
	import CreateTickerDialog from '$lib/ticker/create-ticker-dialog.svelte'
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

	const openCreateTickerDialog = (student) => {
		openModal(CreateTickerDialog, {
			parent_id: student.parent_id,
			parent_nickname: student.parent_nickname,
			onSuccess: ({ticket_amt}) => {
				student.r_t_amt = Number(student.r_t_amt) + Number(ticket_amt)
				student_list = student_list
			}
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