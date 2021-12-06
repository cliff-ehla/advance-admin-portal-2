<script>
	import TrialOptionPreview from '../../lib/reservation/trial-option-preview.svelte'
	import {listZoomReserve, deleteZoomReserve} from "../../api/zoom-api";
	import {onMount, getContext} from 'svelte'
	import {reservation_store} from "../../store/reservation-store";
	const {openModal} = getContext('simple-modal')
	import {page} from '$app/stores'
	import {lockZoomOption} from "../../api/zoom-api";

	let search_text
	let loading

	$: filtered_list = search_text ? $reservation_store.filter(r => r.phone.includes(search_text)) : $reservation_store
	$: status = $page.query.get('status')

	$: list = $reservation_store.filter(item => {
		if (status === 'not-confirm') {
			return !!item.auto_delete_date && !item.student_id
		} else if (status === 'confirm') {
			return !item.auto_delete_date && !item.is_confirmed && !item.student_id
		} else if (status === 'ready') {
			return (!item.auto_delete_date && item.is_confirmed) || (item.student_id)
		}
	})

	onMount(async () => {
		loading = true
		await listZoomReserve()
		loading = false
	})

	const onCancelReserve = async (r) => {
		if (confirm('are you sure')) {
			await deleteZoomReserve({
				reserved_grouper_id: r.grouper_id
			})
			await listZoomReserve()
		}
	}
</script>

<div class="p-4">
	<div class="mb-4 text-gray-500">
		<p><b class="text-gray-700">About this page: </b>Display all the trial options we have provided to the custom, identified by phone number. Confirm the trial options here within 24 hours. Records will be automatically deleted after 24 hours.</p>
	</div>
	<div class="grid grid-cols-2 gap-4">
		{#if loading}
			loading...
		{:else}
			{#if list.length}
				{#each list as r}
					<TrialOptionPreview trial_option={r}
					                    on:update={listZoomReserve}
					                    on:delete={() => {onCancelReserve(r)}}/>
				{/each}
			{:else}
				<p class="p-4">No result</p>
			{/if}
		{/if}
	</div>
</div>