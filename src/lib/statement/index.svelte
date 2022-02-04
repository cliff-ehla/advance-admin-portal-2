<script>
	import dayjs from "dayjs";
	import SelectionBox from '../ui-elements/selection-box.svelte'

	export let statements

	let selected_month = statements[0].month_year
	$: selected_statement = statements.find(s => s.month_year === selected_month)

	let month_options = statements.map(s => ({
		value: s.month_year,
		label: s.month_year
	}))
</script>

<div class="flex items-center px-4 border-b border-gray-300">
	<div class="flex items-center">
		<p class="font-bold mr-4">Monthly statement </p>
		<SelectionBox on:input={e => selected_month = e.detail} selected_value={selected_month} options={month_options}/>
	</div>
	<div class="ml-auto flex items-center">
		<p class="mr-2">Salary</p>
		<div style="font-size: 2em" class="text-t1 font-bold text-blue-500">${selected_statement.salary}</div>
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
			<tr class="border-b border-gray-200 text-sm leading-tight">
				<td>
					{#if t.start_date}
						{dayjs(t.start_date).format('DD MMM')}
					{/if}
				</td>
				<td>{t.is_big_classroom ? 'Classroom' : '1-on-1'}</td>
				<td>{t.title}</td>
				<td>
					{#if t.students && t.students.length}
						{#each t.students as s}
							<span class="mr-1">{s.nickname}</span>
						{/each}
					{/if}
				</td>
				<td>
					{#if t.duration}
						{t.duration}
					{/if}
				</td>
				<td>
					{#if t.s_no_show}
						<p class="text-xs leading-none">Student absent</p>
					{/if}
					{#if t.t_no_show}
						<p class="text-xs leading-none">Teacher absent</p>
					{/if}
					{#if t.is_cancel}
						<p class="text-xs leading-none">Lesson cancel</p>
					{/if}
					{#if t.is_trial}
						<p class="text-xs leading-none">Trial</p>
					{/if}
					{#if t.admin_remark}
						<p class="text-xs leading-none">{t.admin_remark}</p>
					{/if}
				</td>
				<td>{t.salary}</td>
			</tr>
		{/each}
	</table>
</div>

<style>
    td, th {
      padding: 1em;
    }
</style>