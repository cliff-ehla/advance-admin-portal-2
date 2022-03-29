<script context="module">
	import {http, onFail} from "$lib/http";

	export const load = async ({page, fetch}) => {
		const {data, success, debug} = await http.get(fetch, '/adminApi/show_requested_list')
		if (!success) return onFail(debug)
		return {
			props: {
				request_list: data
			}
		}
	}
</script>

<script>
	export let request_list
	import dayjs from "dayjs";
	import relativeTime from "dayjs/plugin/relativeTime.js";
	dayjs.extend(relativeTime)
</script>

<div class="grid">
	{#each request_list as req}
		<div class="p-4">
			<a href="/syllabus/{req.syllabus_id}" class="text-xl mb-1 text-blue-500">{req.code_id}</a>
			{#each req.users as u}
				<div class="grid grid-cols-5 gap-2 items-center border-gray-200 border-b py-1">
					<div>
						<p>{u.nickname}</p>
						<p class="text-sm text-gray-500">{u.username}</p>
					</div>
					<p>{dayjs(u.request_ts).fromNow()}</p>
					<p>{u.level}</p>
					<p>{u.request_level}</p>
					<p>{u.gender}</p>
				</div>
			{/each}
		</div>
	{/each}
</div>