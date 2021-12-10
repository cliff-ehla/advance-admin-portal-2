<script>
	import {student_store} from "../../store/student-store";
	import Icon from '../ui-elements/icon.svelte'
	import {fetchStudentList} from "../../store/org-api";
	import Button from '$lib/ui-elements/button.svelte'
	import {getContext} from 'svelte'
	const {openModal, closeModal} = getContext('simple-modal')
	export let onConfirm = (student_id) => {}

	let student = {}
	const onConfirmClick = () => {
		closeModal()
		onConfirm(student)
	}
</script>


<div class="flex mb-4">
	<div>
		<p class="font-bold">Select a student</p>
		<p class="font-bold text-blue-500">
			{student.student_nickname || '(no student selected)'}
		</p>
	</div>
	<div class="ml-auto mr-10">
		<button on:click={fetchStudentList}>
			<Icon name="refresh" className="w-4"/>
		</button>
	</div>
</div>

<div class="overflow-y-scroll h-96 my-4 border border-gray-300 rounded">
	{#each $student_store as s}
		<div class:text-blue-500={student.student_id === s.student_id} class="cursor-pointer hover:bg-blue-50 px-4 py-2 border-b border-gray-200"
		     on:click={() => {student = s}}>
			<div class="flex items-center">
				<p class="font-bold">{s.student_nickname || '(no name)'}</p>
				<p class="bg-gray-200 border-gray-300 border rounded-sm text-xs ml-2 px-1">{s.level}</p>
			</div>
			<p class="text-sm text-gray-500">@{s.student_username} <span class="ml-2">ID:{s.student_id}</span></p>
		</div>
	{/each}
</div>

<div class="flex justify-between">
	<button class="flex-1 bg-gray-100 hover:border-gray-400 border border-gray-200 rounded px-1 py-1" on:click={closeModal}>取消</button>
	<Button disabled={!student.student_id} button_class="flex-1 py-2 ml-4" on:click={onConfirmClick}>確定</Button>
</div>