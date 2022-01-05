<script>
	import CreateNewUser from './create-new-user.svelte'
	import {getContext} from 'svelte'
	const {closeModal} = getContext('simple-modal')

	export let parent_mobile = undefined
	export let onSuccess = () => {}
	let created_student

	const onConfirmClick = () => {
		onSuccess(created_student)
		closeModal()
	}
</script>

{#if !created_student}
	<h2 class="font-bold mb-4">Create new user</h2>
	<CreateNewUser {parent_mobile} on:created={e => {created_student = e.detail}}/>
{:else}
	<div class="w-96 p-4">
		<p class="font-bold mb-2">Student created</p>
		<p>Username: <b>{created_student.username}</b></p>
		<p>Nickname: <b>{created_student.nickname}</b></p>
		<p>User ID: {created_student.user_id}</p>
		<p>Gender: {created_student.gender}</p>
		<p>Level: {created_student.level}</p>
	</div>

	<button class="mt-4 bg-blue-500 px-4 py-2 rounded text-white" on:click={onConfirmClick}>Confirm</button>
{/if}