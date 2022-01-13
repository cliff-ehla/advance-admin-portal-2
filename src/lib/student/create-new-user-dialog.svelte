<script>
	import CreateNewChilds from './create-new-childs.svelte'
	import {getContext} from 'svelte'
	const {closeModal} = getContext('simple-modal')

	export let parent_mobile = undefined
	export let onSuccess = () => {}
	let childs

	const onConfirmClick = () => {
		onSuccess(childs)
		closeModal()
	}
</script>

{#if !childs}
	<h2 class="font-bold mb-4">Create new user</h2>
	<CreateNewChilds {parent_mobile} on:created={e => {childs = e.detail.childs}}/>
{:else}
	<div class="w-96 p-4">
		<p class="font-bold mb-2">Student(s) created:</p>
		{#each childs as created_student}
			<div class="bg-gray-100 p-2 mb-2">
				<p>Username: <b>{created_student.username}</b></p>
				<p>Nickname: <b>{created_student.nickname}</b></p>
				<p>User ID: {created_student.user_id}</p>
				<p>Gender: {created_student.gender}</p>
				<p>Level: {created_student.level}</p>
			</div>
		{/each}
	</div>

	<button class="mt-4 bg-blue-500 px-4 py-2 rounded text-white" on:click={onConfirmClick}>Confirm</button>
{/if}