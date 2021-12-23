<script>
	import {student_store} from "../../store/student-store.js";
	import Icon from '$lib/ui-elements/icon.svelte'
	import {debounce} from "debounce";
	import {createEventDispatcher} from "svelte";
	const dispatch = createEventDispatcher()
	import {fly} from "svelte/transition";
	import {tooltip} from "$lib/aciton/tooltip.js";
	import {notifications} from "$lib/store/notification.js";

	export let wrapper_class = undefined

	const onInput = e => {
		dispatch('input', e.target.value)
	}
	const onSelect = r => {
		console.log(r)
		phone = r.parent_phone
		if (!phone) {
			notifications.alert(`呢條友冇入到電話，爆番佢DB再黎, parent user_id: ${r.parent_id}`)
		}
		dispatch('input', phone)
	}
	const onBlur = () => {
		focused = false
	}
	let phone = ''
	let focused
	$: filtered_result = student_store.searchUsers(phone)
</script>

<div class:border-blue-500={focused} class="h-10 flex items-stretch relative border border-gray-300 rounded {wrapper_class}">
	<div class="cc w-8 flex-shrink-0">
		<Icon name="phone" className="w-4 text-gray-400"/>
	</div>
	<input on:focus={() => {focused = true}}
	       on:blur={debounce(onBlur, 200)}
	       on:input={onInput}
	       placeholder="Phone"
	       type="text"
	       bind:value={phone}
	       class="px-1 flex-1 max-w-full focus:outline-none"/>

	<div class="w-6 cc flex-shrink-0">
		{#if phone && phone.length === 8}
			{#if filtered_result.length > 0}
				<div use:tooltip={'有幾多個用戶對應呢個電話'} class="w-4 h-4 cc bg-green-500 text-white text-xs rounded-full">
					<p>{filtered_result.length}</p>
				</div>
			{:else}
				<div use:tooltip={'呢個電話係全新'} class="w-4 h-4 cc bg-red-500 text-white text-xs rounded-full">
					<p>新</p>
				</div>
			{/if}
		{/if}
	</div>
	{#if focused}
		<div transition:fly class="absolute shadow border border-gray-300 bg-white p-2 top-full left-0 overflow-y-auto" style="max-height: 200px">
			{#if phone}
				{#if filtered_result.length}
					{#each filtered_result as r}
						<div on:click={() => {onSelect(r)}} class="cursor-pointer p-2 border-gray-300 border-b">
							<p class="text-sm leading-tight text-blue-500">{r.parent_phone}</p>
							<div class="flex text-sm items-center whitespace-nowrap">
								<img src="/parent-icon.png" class="w-6 h-6 rounded-full">
								<p>{r.parent_nickname}</p>
								<img src="/student-m-icon.png" class="w-6 h-6 rounded-full ml-2">
								<p>{r.student_nickname}</p>
							</div>
						</div>
					{/each}
				{:else}
					<p class="text-sm text-gray-500">No search results</p>
				{/if}
			{:else}
				<div class="p-4 text-xs text-gray-500">
					<Icon name="search" className="mx-auto w-8 text-gray-400"/>
					<p class="my-2 text-center">Search phone by</p>
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