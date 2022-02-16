<script context="module">
	import {http, onFail} from "$lib/http";

	export const load = async ({page, fetch}) => {
		if (page.query.get('reload')) {}
		const {data, success, debug} = await http.post(fetch, '/tutorCourseApi/list_tutor_course', {
			teacher_id: page.params.user_id
		})
		if (!success) return onFail(debug)
		return {
			props: {
				classroom_list: data
			}
		}
	}
</script>

<script>
	import {dialog} from "$lib/store/dialog.js";

	export let classroom_list = []
	import {getContext} from 'svelte'
	const {openModal, closeModal} = getContext('simple-modal')
	import CreateTutorCourse from '$lib/classroom/create-tutor-course.svelte'
	import Icon from '$lib/ui-elements/icon.svelte'
	import {page} from "$app/stores";
	import {triggerReload} from "$lib/helper/trigger-reload.js";

	const onCreate = () => {
		openModal(CreateTutorCourse, {
			teacher_id: $page.params.user_id
		}, {
			overflow: 'initial',
			width: '600px'
		})
	}

	const onDelete = async (tutor_course_id) => {
		dialog.confirm({
			message: 'delete classroom and all zoom inside?',
			onConfirm: () => {
				return http.post(fetch, '/tutorCourseApi/delete_tutor_course', {
					tutor_course_id
				}, {
					notification: 'deleted'
				})
			},
			onSuccess: triggerReload
		})
	}
</script>

<div class="p-4">
	{#if classroom_list.length}
		{#each classroom_list as classroom}
			<a href="tutor-course/{classroom.tutor_course_id}" class="block p-4 flex items-center hover:text-blue-500">
				<div>
					<p class="leading-tight">{classroom.title}</p>
					<p class="bg-gray-100 border-gray-300 border px-1 text-xs inline-block">{classroom.code_id}</p>
					<p class="text-gray-500 text-sm">{classroom.level}</p>
					<p class="text-gray-500 text-sm">{classroom.sub_cat_hk}</p>
				</div>
				<button class="ml-4 text-red-500" on:click={() => {onDelete(classroom.tutor_course_id)}}>
					<Icon className="w-4" name="trash"/>
				</button>
			</a>
		{/each}
	{:else}
		No data
	{/if}
	<div class="mt-4 flex justify-end">
		<button class="button" on:click={onCreate}>Create</button>
	</div>
</div>