<script>
	import {student_analytic} from "$lib/store/student-analytic.js";
	import Preview from '$lib/student/student-preview.svelte'
	import {level_options_store} from "../../store/level-options.js";

	let selected_levels = $level_options_store.map(lv => lv.value)
	$: filtered_few_ticker_user = $student_analytic.few_ticker_user.filter(s => {
		return selected_levels.indexOf(s.level) > -1
	})
	$: filtered_new_users = $student_analytic.new_users.filter(s => {
		return selected_levels.indexOf(s.level) > -1
	})
	$: filtered_many_ticker_user = $student_analytic.many_ticker_user.filter(s => {
		return selected_levels.indexOf(s.level) > -1
	})
	$: total = filtered_few_ticker_user.length + filtered_new_users.length + filtered_many_ticker_user.length
	const checkAll = () => {
		selected_levels = $level_options_store.map(lv => lv.value)
	}
	const unCheckAll = () => {
		selected_levels = []
	}
	const onToggle = (e) => {
		const lv = e.target.value
		if (selected_levels.includes(lv)) {
			selected_levels.splice(selected_levels.indexOf(lv),1)
		} else {
			selected_levels.push(lv)
		}
		selected_levels = selected_levels
	}
</script>

<div class="bg-gray-100 p-4">
	<p class="font-bold" style="font-size: 2em">大細班學生總數: {total}</p>
</div>

<div class="py-2">
	<div class="flex">
		{#each $level_options_store as option}
			<div class="flex px-2 items-center px-4">
				<p class="mr-1">{option.label}</p>
				<input value={option.value} checked={selected_levels.includes(option.value)} on:input={onToggle} type="checkbox">
			</div>
		{/each}
	</div>
	<div class="flex mt-2">
		<div class="flex px-2 items-center px-4">
			<button class="button-secondary" on:click={checkAll}>Check all</button>
			<button class="button-secondary ml-4" on:click={unCheckAll}>Uncheck all</button>
		</div>
	</div>
</div>
<div class="flex bg-gray-100 p-4">
	<div class="p-4 bg-white">
		<p class="font-bold mb-4" style="font-size: 2em">大戶(需提醒續費): {filtered_few_ticker_user.length}</p>
		{#each filtered_few_ticker_user as s}
			<Preview {s}/>
		{/each}
		<p class="font-bold mb-4" style="font-size: 2em">新用戶: {filtered_new_users.length}</p>
		{#each filtered_new_users as s}
			<Preview {s}/>
		{/each}
	</div>
	<div class="p-4 bg-white ml-4">
		<p class="font-bold mb-4" style="font-size: 2em">大戶: {filtered_many_ticker_user.length}</p>
		{#each filtered_many_ticker_user as s}
			<Preview {s}/>
		{/each}
	</div>
</div>