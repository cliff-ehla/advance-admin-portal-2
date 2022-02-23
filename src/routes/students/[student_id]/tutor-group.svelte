<script context="module">
	import {http, onFail} from "$lib/http";

	export const load = async ({page, fetch}) => {
		const {data, success, debug} = await http.post(fetch, '/courseApi/list_user_registrable_classroom_for_admin', {
			child_id: page.params.student_id
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
	import TutorGroupOfStudent from '../../../lib/tutor-group/tutor-group-of-student.svelte'
	import {page} from '$app/stores'
	export let classroom_list
	import dayjs from "dayjs";
</script>

<div class="bg-gray-100 p-4 grid gap-4">
	<div class="p-4 bg-white border border-gray-300">
		<h2 class="font-bold mb-4">大班課記錄：</h2>
		{#each classroom_list as c}
			<div class="flex items-center mb-4">
				<img src={c.thumbnail_path_square} alt={c.sub_cat} class="w-36 rounded">
				<div class="ml-4">
					<p class="text-blue-500 italic text-sm">{c.sub_cat}</p>
					<p>{c.name}</p>
					<p>Level: {c.rc_level}</p>
					<p>{dayjs(c.start_date).format('DD MMM YYYY')}</p>
					<p class="text-gray-600 text-sm">試水温? {!c.is_always_open}</p>
				</div>
			</div>
		{/each}
	</div>
	<div class="p-4 bg-white border border-gray-300">
		<h2 class="font-bold mb-4">一對一記錄：</h2>
		<TutorGroupOfStudent student_id={$page.params.student_id}/>
	</div>
</div>