<script context="module">
	import {http, onFail} from "$lib/http";

	export const load = async ({page, fetch}) => {
		const {data, success, debug} = await http.post(fetch, '/tutorCourseApi/list_tutor_course_by_id', {
			tutor_course_id: page.params.tutor_course_id
		})
		if (!success) return onFail(debug)
		return {
			props: {
				course_detail: data
			}
		}
	}
</script>

<script>
	import dayjs from "dayjs";
	import utc from "dayjs/plugin/utc.js";
	dayjs.extend(utc)
	export let course_detail
	$: existing_classroom = course_detail ? course_detail.existing_classroom : []

	const isPast = (classroom) => {
		return dayjs.utc(classroom.start_date).local().isBefore(dayjs())
	}
</script>

<div class="p-4">
	<h2 class="text-xl font-light mb-4">{course_detail.title}</h2>
	{#each existing_classroom as classroom, i}
		<div class="flex relative pb-2">
			<div class="cc z-10 flex-shrink-0 w-4 h-4 border border-green-500 rounded-full {!isPast(classroom) ? 'bg-white' : 'bg-green-500'}"></div>
			{#if i < existing_classroom.length - 1}
				<div class="transform -translate-x-1/2 absolute w-0.5 bg-green-500 inset-y-0 ml-2 top-0 h-full"></div>
			{/if}
			<div class="ml-4">
				<p class="text-gray-500 text-sm">
					<span>{dayjs.utc(classroom.start_date).local().format('DD MMM (ddd), h:mma')}</span>
				</p>
				<div>{classroom.title}</div>
			</div>
		</div>
	{/each}
</div>