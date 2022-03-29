<script>
	import dayjs from "dayjs";
	import SelectionBox from '../ui-elements/selection-box.svelte'

	export let statements
	$: selected_month = statements[0].month_year
	$: selected_statement = statements.find(s => s.month_year === selected_month)
	$: month_options = statements.map(s => ({
		value: s.month_year,
		label: s.month_year
	}))
</script>

{#if selected_statement}
<div class="flex items-center px-4 border-b border-gray-300 py-2">
	<div class="flex items-center">
		<p class="font-bold mr-4 whitespace-nowrap">Monthly statement</p>
		<SelectionBox on:input={e => selected_month = e.detail} selected_value={selected_month} options={month_options}/>
	</div>
	<div class="ml-auto flex items-center">
		<p class="mr-2">Salary</p>
		<div class="text-xl text-blue-500">${selected_statement.salary}</div>
	</div>
</div>

<div class="overflow-scroll" style="height: calc(100vh - 100px)">
	<table class="w-full">
		<tr class="text-left border-b border-gray-300">
			<th>Date</th>
			<th>Type</th>
			<th>Lesson</th>
			<th>Student(s)</th>
			<th>Duration (min)</th>
			<th>Note</th>
			<th>Salary</th>
		</tr>
		{#each selected_statement.zooms as t}
			{#if !t.zoom_id}
				<tr class="border-b border-gray-200 text-sm leading-tight">
					<td></td>
					<td></td>
					<td>{t.title}</td>
					<td></td>
					<td></td>
					<td></td>
					<td>${t.salary}</td>
				</tr>
			{:else}
				<tr class="border-b border-gray-200 text-sm leading-tight">
					<td>{dayjs(t.start_date).format('DD MMM')}</td>
					<td>{t.is_big_classroom ? t.big_classroom_type === 'BIG' ? 'Big class' : 'Small class' : '1-on-1'}</td>
					<td>{t.title}</td>
					<td>
						{#if t.number_of_student > 4}
							{t.number_of_student} students
						{:else}
							{#each t.students as s}
								<p class="mx-1">{s.nickname}</p>
							{/each}
						{/if}
					</td>
					<td>{t.duration}</td>
					<td>
						{#if t.s_no_show}
							<p class="text-xs leading-none">Student absent</p>
						{/if}
						{#if t.t_no_show}
							<p class="text-xs leading-none">Teacher absent</p>
						{/if}
						{#if t.reschedule}
							<p class="text-xs leading-none">Teacher reschedule</p>
						{/if}
						{#if t.is_trial}
							<p class="text-xs leading-none">Trail</p>
						{/if}
						{#if t.admin_remark}
							<p class="text-xs">{t.admin_remark}</p>
						{/if}
					</td>
					<td>
						${t.salary}
						{#if t.is_renewal}
							*
						{/if}
					</td>
				</tr>
			{/if}
		{/each}
	</table>
	<p class="p-4 text-right text-sm text-gray-500">* Renewal incentive is included</p>
</div>
{/if}
<style>
	td, th {
		padding: 1em;
	}
</style>