<script>
	import TutorStatement from '../../../components/statement/index.svelte'
	import {fetchTutorSalary} from "../../../api/zoom-api";
	import {page} from '$app/stores'

	let statements
	let loading

	$: tutor_id = $page.params.user_id

	$: {
		if (tutor_id) {
			fetchData()
		}
	}

	const fetchData = async (t) => {
		loading = true
		statements = await fetchTutorSalary(tutor_id)
		loading = false
	}
</script>

<div class="flex-1">
	{#if loading}
		<div class="p-8">loading....</div>
	{:else if statements && statements.length}
		<TutorStatement {statements}/>
	{:else}
		<div class="p-8">No data</div>
	{/if}
</div>