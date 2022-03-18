<script>
	import {student_store} from "../../store/student-store.js";
	import Icon from '$lib/ui-elements/icon.svelte'
	import Dropdown from '$lib/ui-elements/dropdown3.svelte'
	import {createEventDispatcher} from "svelte";
	const dispatch = createEventDispatcher()

	export let placeholder
	export let placement
	export let search = undefined

	const onSelect = r => {
		search = r.student_nickname
		dispatch('input', r)
	}
	let focused
	$: filtered_result = student_store.searchUsers(search)
</script>

<div class:border-blue-500={focused} class="">
	<Dropdown activator_style="button" open_on_hover={false} {placement}>
		<button slot="activator">{placeholder}</button>
		<div class="dropdown overflow-y-scroll" style="max-height: 400px">
			<input on:click|stopPropagation
			       placeholder="Search..."
			       type="text"
			       bind:value={search}
			       class="input"/>
			{#if search}
				{#if filtered_result.length}
					{#each filtered_result as s}
						<div on:click={() => {onSelect(s)}} class="flex items-center mb-4 group cursor-pointer">
							<div class="flex items-center px-2 py-2.5 leading-tight rounded-full border border-gray-200 group-hover:border-blue-500 group-hover:bg-gray-100">
								<img src={student_store.getStudentAvatar(s.user_id)} alt="student" class="w-8 h-8 rounded-full">
								<div class="ml-2">
									<p class="font-bold flex items-center">{s.student_nickname} <span class="text-xs bg-gray-100 border border-gray-300 px-0.5 ml-1 text-gray-500 ">{s.level}</span></p>
								</div>
							</div>
							<div class="h-0.5 bg-gray-400 w-4"></div>
							<div>
								<div class="flex items-center leading-tight rounded-full border border-gray-200 group-hover:border-blue-500 group-hover:bg-gray-100">
									<div class="flex items-center px-2 py-1">
										<img src="/parent-icon.png" alt="parent" class="w-8 h-8 rounded-full mx-1.5">
										<div class="ml-1">
											<p class="font-bold">{s.parent_nickname}</p>
											<p class="text-xs text-gray-500 mt-0.5"><span style="font-size: 0.8em" class="mr-0.5">☎</span> {s.parent_search}</p>
										</div>
									</div>
									<div class="px-2 py-1 ml-2 border-l border-gray-200">
										<div class="flex items-center">
											<img src="/ticket.jpg" alt="ticket" class="w-6 h-6 rounded-full">
											<p class="ml-1">{s.r_t_amt}張</p>
										</div>
										<p class="text-xs text-gray-500 mt-0.5">已用: {s.used_t_amt}, 總共: {s.tt_t_amt}</p>
									</div>
								</div>
							</div>
						</div>
					{/each}
				{:else}
					<p class="text-sm text-gray-500">No search results</p>
				{/if}
			{:else}
				<div class="p-4 text-xs text-gray-500">
					<Icon name="search" className="mx-auto w-8 text-gray-400"/>
					<p class="my-2 text-center">Search user by</p>
					<ul class="list-disc">
						<li>parent nickname</li>
						<li>student nickname</li>
						<li>phone</li>
					</ul>
				</div>
			{/if}
		</div>
	</Dropdown>
</div>