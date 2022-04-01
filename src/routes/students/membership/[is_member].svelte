<script context="module">
	import {http, onFail} from "$lib/http";

	export const load = async ({page, fetch}) => {
		const {data, success, debug} = await http.get(fetch, '/aiMembershipForceOpen/list_all', {
			is_member: page.params.is_member
		})
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
	import {getContext} from 'svelte'
	const {openModal, closeModal} = getContext('simple-modal')
	import SetMembershipDate from '$lib/student/set-membership-date.svelte'

	export let list

	const onEdit = (user_id, nickname, type, obj, student) => {
		let start_date = obj ? obj.start_date : dayjs().format('YYYY-MM-DD')
		let end_date = obj ? obj.end_date : dayjs().format('YYYY-MM-DD')
		openModal(SetMembershipDate, {
			type,
			user_id,
			nickname,
			start_date,
			end_date,
			onSuccess: ({start_date, end_date}) => {
				student[type] = {}
				student[type] = {
					start_date, end_date
				}
				list = list
			}
		}, {
			overflow: 'initial'
		})
	}
</script>
<div class="container py-4">
	{#each list as s}
		<div class="p-4 flex items-center border-b border-gray-200">
			<div class="mr-4">
				<p>{s.nickname} <span class="px-1 leading py-0.5 text-xs text-gray-500 bg-gray-100 ml-1">{s.user_id}</span></p>
				<p class="text-sm text-gray-500">{s.parent_nickname || 'No name'} <span class="px-1 leading py-0.5 text-xs text-gray-500 bg-gray-100 ml-1">{s.parent_id}</span></p>
			</div>
			{#each ['vocab','dictation','speak'] as type}
				<div on:click={() => {onEdit(s.user_id, s.nickname, type, s[type], s)}} class="flex mx-1">
					<div class="{s[type] ? dayjs(s[type].end_date).isAfter(dayjs()) ? 'bg-blue-500 text-white hover:bg-blue-400' : 'bg-gray-100 border border-gray-300 hover:bg-gray-200' : 'bg-gray-50 text-gray-300 hover:bg-gray-100 hover:text-gray-500'} rounded p-2 cursor-pointer">
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