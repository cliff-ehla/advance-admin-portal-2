<script>
	import CreateNewUser from './create-new-user.svelte'
	import StudentSelectionBox from './student-selection-box.svelte'
	import Icon from '../ui-elements/icon.svelte'
	import {fetchStudentList} from "../../store/org-api";
	import {createEventDispatcher} from 'svelte'
	const dispatch = createEventDispatcher()

	let is_new = false
	export let selected_student_id = undefined

	const onNewStudentCreated = (e) => {
		selected_student_id = e.detail.user_id
		fetchStudentList()
		is_new = false
		dispatch('input', selected_student_id)
	}

	const onSelected = (e) => {
		selected_student_id = e.detail
		dispatch('input', selected_student_id)
	}
</script>

<div class="relative">
	{#if !is_new}
		<StudentSelectionBox on:input={onSelected} selected_value={selected_student_id}/>
		<div class="py-1 text-xs text-gray-500 px-2">
			For new student, please
			<spab on:click={() => {is_new = true}} class="cursor-pointer inline-block text-blue-500 hover:text-blue-300 border-b border-current">register a new user</spab>
		</div>
	{:else}
		<div class="bg-gray-100 p-4">
			<button class="absolute right-4 top-4" on:click={() => {is_new = false}}>
				<Icon name="close" className="w-4"/>
			</button>
			<div class="mb-4">
				<p class="text-lg font-bold">Create user</p>
			</div>
			<CreateNewUser on:created={onNewStudentCreated}/>
		</div>
	{/if}
</div>