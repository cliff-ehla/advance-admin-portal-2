<script>
	import {student_store} from "../../store/student-store.js";
	import Icon from '$lib/ui-elements/icon.svelte'
	import {debounce} from "debounce";
	import {createEventDispatcher} from "svelte";
	const dispatch = createEventDispatcher()
	import {fly} from "svelte/transition";

	export let wrapper_class = undefined
	export let search = undefined

	const onSelect = r => {
		console.log(r)
		search = r.student_nickname
		dispatch('input', r)
	}
	const onBlur = () => {
		focused = false
	}
	let focused
	$: filtered_result = student_store.searchUsers(search)
</script>

<div class:border-blue-500={focused} class="h-10 flex items-stretch relative border border-gray-300 rounded {wrapper_class}">
	<div class="cc w-8 flex-shrink-0">
		<Icon name="search" className="w-5 text-gray-400"/>
	</div>
	<input on:focus={() => {focused = true}}
	       on:blur={debounce(onBlur, 200)}
	       placeholder="Search user"
	       type="text"
	       bind:value={search}
	       class="px-1 flex-1 max-w-full focus:outline-none"/>
	{#if focused}
		<div transition:fly class="absolute shadow border border-gray-300 bg-white p-2 top-full left-0 overflow-y-auto rounded" style="max-height: 400px">
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
	{/if}
</div>