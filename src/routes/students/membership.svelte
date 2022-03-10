<script context="module">
	import {http, onFail} from "$lib/http";

	export const load = async ({page, fetch}) => {
		const {data, success, debug} = await http.get(fetch, '/aiMembershipForceOpen/list_all')
		if (!success) return onFail(debug)
		return {
			props: {
				list: data
			}
		}
	}
</script>

<script>
	import dayjs from "dayjs";

	export let list
</script>

<div class="container py-4">
	{#each list as s}
		<div class="p-4 flex items-center border-b border-gray-200">
			<div class="mr-4">
				<p>{s.nickname} <span class="px-1 leading py-0.5 text-xs text-gray-500 bg-gray-100 ml-1">{s.user_id}</span></p>
				<p class="text-sm text-gray-500">{s.parent_nickname || 'NA'} <span class="px-1 leading py-0.5 text-xs text-gray-500 bg-gray-100 ml-1">{s.parent_id}</span></p>
			</div>
			{#each ['vocab','dictation','speak'] as type}
				<div class="flex mx-1">
					<div class="{s[type] ? dayjs(s[type].end_date).isAfter(dayjs()) ? 'bg-blue-500 text-white' : 'bg-gray-100 border border-gray-300' : 'bg-gray-50 text-gray-300'} rounded p-2">
						<p class="text-xs">{type}</p>
						{#if s[type]}
							<p class="text-sm">{dayjs(s[type].start_date).format('DD MMM YYYY')} - {dayjs(s[type].end_date).format('DD MMM YYYY')}</p>
						{:else}
							N/A
						{/if}
					</div>
				</div>
			{/each}
		</div>
	{/each}
</div>