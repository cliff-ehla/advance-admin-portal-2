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
	console.log('cliff: ', request_list)
	import dayjs from "dayjs";
</script>

<div class="grid grid-cols-3 gap-2">
	{#each request_list as req}
		<div class="p-4">
			<div class="flex items-center">
				<img src={req.thumbnail_path} alt={req.name} class="w-40 rounded">
				<div class="ml-4">
					<p class="mb-2">{dayjs(req.create_ts).format('DD MMM, YYYY')}</p>
					<p class="text-blue-500 text-xl ">{req.name}</p>
					<div class="flex">
						<p class="text-xs text-gray-500">{req.level}</p>
						<p class="text-xs text-gray-400 ml-2">{req.class_code}</p>
					</div>
					<div class="rounded-full inline-block mt-2">
						<p class="font-bold">{req.username}</p>
						<p class="text-sm">Tel: {req.phone}  <span class="text-gray-500">(ID: {req.user_id})</span></p>
					</div>
				</div>
			</div>
		</div>
	{/each}
</div>