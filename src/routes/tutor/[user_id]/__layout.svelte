<script>
	import {tutor_store} from "../../../store/tutor-store";
	import {goto} from '$app/navigation'
	import {page} from '$app/stores'
	import dayjs from "dayjs";
	import Dropdown from '../../../components/ui-elements/dropdown3.svelte'

	export let segment

	$: tutor_id = $page.params.user_id
	$: YYYY_MM = $page.params.YYYY_MM || dayjs().format('YYYY-MM')

	const onTutorSelected = tutor => {
		goto(`/tutor/${tutor.user_id}/${YYYY_MM}`)
	}
</script>

<div class="flex">
	<div style="height: calc(100vh - 3em)" class="w-40 max-h-full overflow-y-scroll bg-gray-100 flex flex-col">
		<div class="h-16 flex items-center font-bold px-4 border-b border-gray-300">
			Teacher
		</div>
		<div class="flex-1 overflow-y-scroll">
			{#each $tutor_store as tutor}
				<Dropdown placement="right" delay={20}
				          activator_active_style="bg-blue-800 text-white"
				          activator_style="w-full px-4 py-3 border-b border-gray-200 {tutor_id === tutor.user_id ? 'bg-blue-800 text-white' : ''}">
					<div slot="activator" on:click={onTutorSelected(tutor)}>
						<div>{tutor.nickname}</div>
					</div>
					<div class="py-2 bg-white shadow-lg border border-gray-200 rounded">
						<a href="/tutor/{tutor.user_id}/statement" class="block hover:text-blue-500 hover:bg-gray-100 px-4 py-2">Statement</a>
						<a href="/tutor/{tutor.user_id}/{YYYY_MM}" class="block hover:text-blue-500 hover:bg-gray-100 px-4 py-2">Monthly Schedule</a>
						<a href="/tutor/{tutor.user_id}/schedule" class="block hover:text-blue-500 hover:bg-gray-100 px-4 py-2">Weekly Schedule</a>
						<a href="/tutor/{tutor.user_id}/available-timetable" class="block hover:text-blue-500 hover:bg-gray-100 px-4 py-2">Available</a>
					</div>
				</Dropdown>
			{/each}
		</div>
	</div>
	<div class="flex-1">
		<slot/>
	</div>
</div>