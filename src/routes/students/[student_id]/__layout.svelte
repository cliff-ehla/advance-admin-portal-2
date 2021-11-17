<script>
	export let segment
	import {page} from '$app/stores'
	$: student_id = $page.params.student_id
	import {student_store} from "../../../store/student-store";

	$: items = [
		{
			label: 'Tutor group',
			href: `/students/${$page.params.student_id}/tutor-group`,
			segment: 'tutor-group',
		},
		{
			label: 'Notes',
			href: `/students/${$page.params.student_id}/note`,
			segment: 'notes',
		}
	]
</script>

<div class="flex px-4 pt-2 items-center bg-blue-100 border-b border-gray-400">
	<div class="inline-flex items-center border-r border-gray-400">
		<p class="h-10 px-8 flex items-center font-bold">{student_store.getStudentName($page.params.student_id)}</p>
		{#each items as item}
			<a href={item.href} class="{segment === item.segment ? '' : 'bg-opacity-50'} hover:bg-opacity-80 cursor-pointer bg-white h-10 px-8 flex items-center justify-center border-l border-t border-gray-400 bg-white relative"
			   style="top: 1px">{item.label}</a>
		{/each}
	</div>
</div>

<div class="p-4">
<slot></slot>
</div>