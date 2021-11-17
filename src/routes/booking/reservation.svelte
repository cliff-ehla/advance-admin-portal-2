<script>
	import {listZoomReserved} from "../../api/zoom-api";
	import {onMount} from 'svelte'
	import dayjs from "dayjs";
	import utc from "dayjs/plugin/utc";
	dayjs.extend(utc)
	import {confirmZoomReserved} from "../../api/zoom-api";

	let reserved
	let loading = false

	const fetchData = async () => {
		reserved = await listZoomReserved()
	}

	const getRemainingTime = (end_time) => {
		end_time = dayjs.utc(end_time).local()
		let now = dayjs()
		let remains = dayjs(end_time).diff(now, 'hour')
		return Math.max(24 - remains, 0)
	}

	const onConfirm = async (r) => {
		if (loading) return
		loading = true
		await confirmZoomReserved({
			grouper_id: r.grouper_id
		})
		loading = false
		reserved = []
		await fetchData()
	}

	onMount(async () => {
		await fetchData()
	})
</script>

<div class="p-4">
	{#if reserved}
		<div class="grid grid-cols-2 gap-4">
			{#if reserved.length}
				{#each reserved as r}
					<div class="mb-4">
						<div class="border rounded border-gray-300 rounded">
							<div class="px-4 py-1 bg-gray-100 text-xs">
								<p>Created by <i class="font-bold">{r.username} {getRemainingTime(r.auto_delete_date)} hour</i> ago</p>
							</div>
							<div class="px-4 py-2">
								<div class="flex mb-4">
									<div class="flex-1">
										<p class="text-xs text-gray-500">Student name</p>
										<p class="font-bold">{r.student_nickname}</p>
									</div>
									<div class="flex-1">
										<p class="text-xs text-gray-500">Teacher name</p>
										<a href="tutor/{r.reserves[0].teacher_id}/{dayjs().format('YYYY-MM')}" class="font-bold">{r.reserves[0].teacher_nickname}</a>
									</div>
								</div>
								<div>
									{#each r.reserves as slot}
										<div class="flex py-2">
											<p>{dayjs.utc(slot.start_date).local().format('MMM DD (ddd) hh:mma')}</p> -
											<p>{dayjs.utc(slot.end_date).local().format('hh:mma')}</p>
										</div>
									{/each}
								</div>
								<div class="mt-4">
									<button class="flex items-center justify-center h-10 text-blue-500 w-full bg-gray-100 hover:bg-gray-200" on:click={() => {onConfirm(r)}}>
										{loading ? 'Loading...' : 'Confirm'}
									</button>
								</div>
							</div>
						</div>
					</div>
				{/each}
			{:else}
				No reservations currently
			{/if}
		</div>
	{/if}
</div>
