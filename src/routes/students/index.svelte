<script>
	import {http} from "$lib/http";
	import {getContext} from 'svelte'
	const {openModal} = getContext('simple-modal')
	import CreateUserDialog from '$lib/student/create-new-user-dialog.svelte'
	import Icon from '$lib/ui-elements/icon.svelte'
	import CreateTickerDialog from '$lib/ticker/create-ticker-dialog.svelte'
	import {student_store} from "../../store/student-store";

	export let student_list = []

	const onAdd = () => {
		openModal(CreateUserDialog, {
			onSuccess: async () => {
				const {data} = await http.get(fetch, '/adminApi/list_students_with_ticket_info')
				student_list = data
			}
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
		<div class="flex items-center mb-4">
			<a href="/students/{s.student_id}/tutor-group" class="flex items-center px-2 py-1 leading-tight rounded-full border border-gray-400 hover:border-blue-500 hover:bg-gray-200">
				{#if s.gender === 'm'}
					<img src="/student-m-icon.png" alt="student" class="w-8 h-8 rounded-full">
				{:else if s.gender === 'f'}
					<img src="/student-f-icon.jpg" alt="student" class="w-8 h-8 rounded-full">
				{/if}
				<div class="ml-2">
					<p class="font-bold flex items-center">{s.student_nickname} <span class="text-xs bg-gray-100 border border-gray-300 px-0.5 ml-1 text-gray-500">{s.level}</span></p>
					<p class="text-xs text-gray-500">@{s.student_username} <span class="ml-1">ID:{s.student_id}</span></p>
				</div>
			</a>
			<div class="h-0.5 bg-gray-400 w-8"></div>
			<div>
				<div class="flex items-center leading-tight rounded-full border border-gray-400 hover:border-blue-500">
					<div class="flex items-center px-2 py-1">
						<img src="/parent-icon.png" alt="parent" class="w-8 h-8 rounded-full">
						<div class="ml-1">
							<p class="font-bold">{s.parent_nickname}</p>
							<p class="text-xs text-gray-500">@{s.parent_username}</p>
						</div>
					</div>
					<div class="px-2 py-1 ml-2 border-l border-gray-400">
						<div class="flex items-center">
							<img src="/ticket.jpg" alt="ticket" class="w-6 h-6 rounded-full">
							<p class="ml-1">{s.r_t_amt}張</p>
							<button on:click={() => {openCreateTickerDialog(s)}} class="text-blue-500 border-gray-400 hover:bg-blue-500 hover:text-white border p-1 rounded-full ml-1">
								<Icon name="add" className="w-3"/>
							</button>
						</div>
						<p class="text-xs text-gray-500 mt-0.5">已用: {s.used_t_amt}, 總共: {s.tt_t_amt}</p>
					</div>
				</div>
			</div>
		</div>
	{/each}
</div>

<button class="fixed right-4 bottom-4 w-12 h-12 rounded-full flex items-center justify-center text-white bg-blue-500 hover:bg-blue-700"
        on:click={onAdd}>
	<Icon name="add"/>
</button>