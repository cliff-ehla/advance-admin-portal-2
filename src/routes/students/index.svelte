<script context="module">
	import {http, onFail} from "$lib/http";

	export const load = async ({fetch}) => {
		const res = await http.get(fetch, '/adminApi/list_students_with_ticket_info')
		console.log(123, res)
		return true
		// if (!success) return onFail(debug)
		/*
		return {
			props: {
				student_list: data
			}
		}*/
	}
</script>

<script>
	import {student_store} from "../../store/student-store";
	import {fetchStudentList} from "../../store/org-api";
	import {getContext} from 'svelte'
	const {openModal} = getContext('simple-modal')
	import CreateUserDialog from '$lib/student/create-new-user-dialog.svelte'
	import Icon from '$lib/ui-elements/icon.svelte'

	export let student_list
	console.log(student_list)

	const onAdd = () => {
		openModal(CreateUserDialog, {
			onSuccess: fetchStudentList
		})
	}
</script>

<div class="p-4 bg-gray-50">
	{#if $student_store}
		{#each $student_store as s}
			<a class="block p-4 bg-white mb-2 rounded shadow hover:text-blue-500" href="/students/{s.user_id}/tutor-group">
				<p class="font-bold">{s.nickname} ({s.level})</p>
				<p class="text-sm text-gray-500">{s.username} {s.user_id}</p>
			</a>
		{/each}
	{/if}
</div>

<button class="fixed right-4 bottom-4 w-12 h-12 rounded-full flex items-center justify-center text-white bg-blue-500 hover:bg-blue-700"
        on:click={onAdd}>
	<Icon name="add"/>
</button>