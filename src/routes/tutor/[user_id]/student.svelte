<script context="module">
	import {http, onFail} from "$lib/http";

	export const load = async ({page, fetch}) => {
		const {data, success, debug} = await http.post(fetch, '/tutorApi/list_fans',{
			teacher_id: page.params.user_id
		})
		if (!success) return onFail(debug)
		return {
			props: {
				student_list: data
			}
		}
	}
</script>

<script>
	export let student_list
	import dayjs from "dayjs";
	import {capitalize} from "$lib/helper/capitalize.js";
	import Icon from '$lib/ui-elements/icon.svelte'
	import Selection from '$lib/ui-elements/selection-box.svelte'
	import {tooltip} from "$lib/aciton/tooltip.js";

	$: active_student_count = student_list.filter(s => s.upcoming_zoom_cnt > 0).length
	$: sorted_student_list = student_list.sort((a,b) => {
		if (a[sort_by] === b[sort_by]) return 0
		if (a[sort_by] > b[sort_by]) return -1
		if (a[sort_by] < b[sort_by]) return 1
	})
	$: filtered_list = search_text ? sorted_student_list.filter(s => {
		return s.nickname.toLowerCase().includes(search_text.toLowerCase())
	}) : sorted_student_list
	const options = [
		{
			label: 'Upcoming lessons',
			value: 'upcoming_zoom_cnt'
		},
		{
			label: 'Completed lessons',
			value: 'completed_zoom_cnt'
		},
		{
			label: 'Last lesson date',
			value: 'last_lesson_date'
		}
	]

	let sort_by = 'upcoming_zoom_cnt'
	let search_text
</script>

<div class="bg-gray-100">
	<div class="container pb-8">
		<div class="flex items-center justify-between py-4">
			<div>
				<h1 class="page-title">My Students</h1>
				<div class="flex items-center">
					<div class="w-2.5 h-2.5 rounded-full bg-green-500 mx-0.5 mt-0.5"></div>
					<p use:tooltip={'Students with upcoming lessons'} class="text-gray-700 ml-1 text-green-700">Active students
						<span class="bg-green-500 px-1 rounded text-white text-sm">{active_student_count}</span>
					</p>
				</div>
			</div>
			<div class="ml-auto flex items-center">
				<input type="text"
				       class="bg-gray-50 hover:bg-white px-4 py-3 border border-gray-300 rounded hover:border-blue-500 focus:border-blue-500 mr-2"
				       bind:value={search_text} placeholder="Search by name">
				<Selection {options}
				           icon="sort"
				           label="Sort by"
				           selected_value={sort_by} on:input={e => sort_by = e.detail}/>
			</div>
		</div>
		<div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
			{#if filtered_list.length}
				{#each filtered_list as s}
					<a href="/students/{s.user_id}" class="p-4 flex items-center {s.upcoming_zoom_cnt ? 'bg-white border-blue-200' : 'bg-gray-50'} rounded border-2 border-gray-200 hover:shadow-lg hover:border-blue-500 transition-shadow">
						<div class="w-20 h-20 rounded-full border-2 border-gray-300 relative shadow flex-shrink-0">
							<img src="/student-{s.gender}-icon.png" alt="gender" class="rounded-full">
							<div class="absolute -bottom-2 -right-4 ml-2 w-10 h-10 bg-blue-500 rounded-full cc text-white">{capitalize(s.level)}</div>
						</div>
						<div class="ml-6">
							<p class="font-bold">{s.nickname}</p>
							<p class="text-xs text-gray-500 mb-1">Seen <b>{dayjs().diff(dayjs(s.last_lesson_date),'day')}</b> days before</p>
							{#if s.upcoming_zoom_cnt}
								<div class="inline-flex items-center text-xs">
									<div class="w-2.5 h-2.5 mr-0.5 rounded-full bg-green-500 shadow"></div>
									<div class="ml-1 text-green-600"><b>{s.upcoming_zoom_cnt}</b> <span class="text-green-700">Upcoming Lessons</span></div>
								</div>
							{:else}
								<div class="inline-flex items-center text-xs">
									<div class="w-2 h-2 rounded-full bg-gray-300 mx-0.5"></div>
									<div class="ml-1"><span class="text-gray-400">No upcoming lessons</span></div>
								</div>
							{/if}
							<div class="inline-flex items-center text-xs">
								<Icon name="stopwatch" className="w-3 text-gray-400"/>
								<div class="ml-1"><b class="text-gray-500">{s.completed_zoom_cnt}</b> <span class="text-gray-500">Completed Lessons</span></div>
							</div>
						</div>
					</a>
				{/each}
			{:else}
				<div class="note">No result found</div>
			{/if}
		</div>
	</div>
</div>