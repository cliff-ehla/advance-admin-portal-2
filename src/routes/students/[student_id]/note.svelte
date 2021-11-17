<script>
	import {page} from '$app/stores'
	import {getContext, onMount} from 'svelte'
	import {listStudentNote} from "../../../api/student-note-api";
	const {openModal} = getContext('simple-modal')
	import CreateNodeDialog from '../../../components/note/create-note-dialog.svelte'
	import dayjs from "dayjs";
	import {student_store} from "../../../store/student-store";

	let list

	const onCreate = () => {
		openModal(CreateNodeDialog, {
			student_id: $page.params.student_id,
			onCreateNoteSuccess: fetchData
		})
	}

	const fetchData = async () => {
		list = await listStudentNote({
			student_id: $page.params.student_id
		})
	}

	const onEdit = (item) => {
		console.log(item)
		openModal(CreateNodeDialog, {
			student_id: $page.params.student_id,
			teacher_id: item.teacher_id,
			note: item.note,
			onCreateNoteSuccess: fetchData,
			is_edit: true,
			note_id: item.note_id
		})
	}

	onMount(() => {
		fetchData()
	})
</script>


<p class="font-bold p-4">{$student_store ? student_store.getStudentName($page.params.student_id) : ''} note</p>
<div class="p-4">
	{#if list}
		<table class="w-full">
		<tr class="font-bold">
			<td>Date</td>
			<td>Message</td>
			<td>Teacher</td>
			<td></td>
		</tr>
		{#if list.length}
			{#each list as item}
				<tr class="p-4 border-b border-gray-200">
					<td class="">{dayjs(item.update_ts).format('MMM DD')}</td>
					<td class="">{item.note}</td>
					<td>{item.nickname || '-'}</td>
					<td class="text-right">
						<button class="p-2 bg-gray-100 text-blue-500 hover:text-blue-700 rounded" on:click={() => {onEdit(item)}}>Edit</button>
					</td>
				</tr>
			{/each}
		{:else}
			no data
		{/if}
		</table>
	{:else}
		loading...
	{/if}
</div>
<div class="p-4">
	<button class="bg-blue-500 hover:bg-blue-700 text-white rounded px-8 py-2" on:click={onCreate}>Create new note</button>
</div>

<style>
	td {
			padding: 1em;
			border-bottom: 1px solid #f0f0f0;
	}
</style>