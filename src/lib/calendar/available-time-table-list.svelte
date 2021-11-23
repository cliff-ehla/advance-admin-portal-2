<script>
	export let time_slot_list
	export let teacher_id
	console.log('teacher_id', teacher_id)

	import TimeTable from './avaialble-time-table.svelte'
	import dayjs from "dayjs";
	import {setTutorAvailableTimeSlot} from "../../api/tutor-api";

	let selected_time_slot = time_slot_list.length ? time_slot_list[0] : null
	let render = true

	const onTimeSlotSelect = (timeslot) => {
		selected_time_slot = timeslot
		render = false
		setTimeout(() => {
			render = true
		})
	}

	const onCreateNewSlot = async () => {
		let start
		if (time_slot_list.length) {
			start = dayjs(time_slot_list[time_slot_list.length - 1].end_time, 'YYYY-MM-DD HH:mm:ss').add(1, 'day')
		} else {
			start = dayjs()
		}
		let end = start.add(10, 'week')
		let create_new_timeslot_payload = {
			start_time: dayjs(start).format('YYYY-MM-DD HH:mm:ss'),
			end_time: dayjs(end).format('YYYY-MM-DD HH:mm:ss'),
			timeslot: [],
			teacher_id
		}
		selected_time_slot = await setTutorAvailableTimeSlot(create_new_timeslot_payload)
		render = false
		setTimeout(() => {
			render = true
		}, 10)
		time_slot_list.push(selected_time_slot)
		time_slot_list = time_slot_list
	}

	const onUpdate = (e) => {
		let edited_timeslot_id = e.detail.timeslot_id
		const idx = time_slot_list.findIndex(s => s.timeslot_id === edited_timeslot_id)
		time_slot_list.splice(idx, 1, e.detail)
		time_slot_list = time_slot_list
	}

	const onDelete = (e) => {
		let edited_timeslot_id = e.detail.timeslot_id
		const idx = time_slot_list.findIndex(s => s.timeslot_id === edited_timeslot_id)
		time_slot_list.splice(idx, 1)
		selected_time_slot = null
	}
</script>

<div class="flex">
	<div class="w-56 border-r border-gray-300 mr-4">
		<p class="font-bold p-4 border-b border-gray-300 mb-4">Time slot(s)</p>
		<div class="p-2 border-b border-gray-300">
			{#each time_slot_list as timeslot}
				<div on:click={() => {onTimeSlotSelect(timeslot)}} class="cursor-pointer p-4 {selected_time_slot === timeslot ? 'bg-blue-100 text-blue-500' : ''}">
					{dayjs(timeslot.start_time).format('DD MMM')} -
					{dayjs(timeslot.end_time).format('DD MMM')}
				</div>
			{/each}
		</div>
		<div class="p-4 text-center">
			<button class="py-2 px-8 rounded bg-blue-500 text-white" on:click={onCreateNewSlot}>Create new slot</button>
		</div>
	</div>
	<div class="flex-1">
		{#if selected_time_slot && render}
			<TimeTable
							{teacher_id}
							on:delete={onDelete}
							on:update={onUpdate}
							start_day={selected_time_slot.start_time}
							end_day={selected_time_slot.end_time}
							timeslot_id={selected_time_slot.timeslot_id}
							events={selected_time_slot.timeslot}/>
		{/if}
	</div>
</div>