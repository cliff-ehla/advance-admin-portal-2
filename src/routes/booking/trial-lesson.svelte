<script>
	import {onMount} from 'svelte'
	import {listZoomTrial} from "../../api/zoom-api";
	import TrialPreview from '../../components/reservation/trial-preview.svelte'
	import dayjs from "dayjs";

	let trial

	onMount(() => {
		fetchData()
	})

	const fetchData = async () => {
		trial = []
		trial = await listZoomTrial()
		trial = trial.sort((a,b) => {
			return dayjs(a.start_date).isBefore(dayjs(b.start_date)) ? 1: -1
		})
		trial = trial.sort((a,b) => {
			return a.is_trial_success ? -1 : 1
		})
	}

	const onFail = () => {
		fetchData()
	}
</script>

{#if trial}
	<div class="px-4">
		<table class="w-full">
			<tr class="border-b border-gray-300 text-left">
				<th class="text-left p-4">Date</th>
				<th class="p-4">Student</th>
				<th class="p-4">Teacher</th>
				<th class="p-4">Status</th>
				<th class="p-4">Message</th>
				<th></th>
			</tr>
			{#each trial as t}
				<TrialPreview on:fail={onFail} {t}/>
			{/each}
		</table>
	</div>
{/if}