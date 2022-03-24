<script context="module">
	import {http, onFail} from "$lib/http";

	export const load = async ({page, fetch}) => {
		const {data, success, debug} = await http.post(fetch, '/courseApi/list_user_registrable_classroom_for_admin', {
			child_id: page.params.student_id
		})
		if (!success) return onFail(debug)
		return {
			props: {
				billing_list: data
			}
		}
	}
</script>

<script>
	export let billing_list
	import dayjs from "dayjs";
</script>

<table class="text-sm w-full border border-gray-200">
	<tr>
		<th>Date</th>
		<th>Class</th>
		<th>Tutor</th>
		<th>Type</th>
		<th>Ticket</th>
	</tr>
	{#each billing_list as b}
		<tr>
			<td>{dayjs(b.start_date).format('DD MMM YYYY')}</td>
			<td>
				<div class="text-sm">{b.name}</div>
				{#if b.sub_cat_alter}
					<div class="text-xs text-gray-500">{b.sub_cat_alter}</div>
				{/if}
			</td>
			<td>
				{b.tutor_name}
			</td>
			<td>
				{b.rc_type === 'big' ? '大班課' : b.rc_type === 'small' ? '小班課' : '大班課'}
			</td>
			<td>{b.ticket}</td>
		</tr>
	{/each}
</table>

<style>
	td, th {
		@apply px-4 py-3 text-left border-b border-gray-200;
	}
</style>