<script>
	import {createStudentNote, updateStudentNote} from "../../api/student-note-api";
	import {getContext} from 'svelte'
	const {closeModal} = getContext('simple-modal')
	import {tutor_store} from "../../store/tutor-store";
	import SelectionBox from '../../components/ui-elements/selection-box.svelte'
	import Dropdown from '../../components/ui-elements/dropdown3.svelte'
	import Icon from '../../components/ui-elements/icon.svelte'
	import {deleteStudentNote} from "../../api/student-note-api";

	export let is_edit
	export let note
	export let note_id
	export let student_id
	export let teacher_id
	export let onCreateNoteSuccess = () => {}

	let loading

	const onConfirm = async () => {
		if (loading) return
		loading = true
		if (is_edit) {
			await updateStudentNote({
				note_id, note, student_id, teacher_id
			})
		} else {
			await createStudentNote({
				note, student_id, teacher_id
			})
		}
		loading = false
		closeModal()
		onCreateNoteSuccess()
	}

	const onDeleteClick = async () => {
		await deleteStudentNote({note_id})
		closeModal()
		onCreateNoteSuccess()
	}
</script>

<div>
	<div class="flex items-center h-12 mb-4">
		<p class="flex-1 font-bold">{is_edit ? 'Edit' : 'Create'} note</p>
		{#if is_edit}
			<Dropdown placement="bottom-end">
				<button slot="activator" class="w-10 h-10 flex items-center justify-center">
					<Icon className="w-6" name="more"/>
				</button>
				<div class="shadow-lg bg-white border border-gray-300 w-64">
					<div on:click={onDeleteClick} class="px-4 py-2 hover:text-gray-100 hover:text-red-500 cursor-pointer">Delete</div>
				</div>
			</Dropdown>
		{/if}
	</div>
	<SelectionBox on:input={e => {teacher_id = e.detail}} selected_value={teacher_id} options={$tutor_store} label_key="nickname" value_key="user_id"/>

	<div class="my-4">
		<textarea placeholder="type the note here" class="p-4 border border-gray-300 rounded w-full" bind:value={note} cols="30" rows="10"></textarea>
	</div>

	<div class="flex">
		<button class="hover:bg-gray-100 rounded py-2 flex-1 border-gray-200 border" on:click={closeModal}>Cancel</button>
		<button class="{loading ? 'text-gray-400' : 'bg-blue-500 hover:bg-blue-700'} text-white rounded py-2 flex-1 ml-4" on:click={onConfirm}>{loading ? 'Loading...' : 'Confirm'}</button>
	</div>
</div>