<script>
	import {fetchTutorSchedule} from "../../api/admin-api";
	import {convertToEvents, genBookedEventFromZoom} from "./phase-to-events";
	import {eventContent} from "./shared-function/event-content";
	import dayjs from "dayjs";
	import {getContext} from "svelte";
	const {openPopper} = getContext('popper')
	const {openModal} = getContext('simple-modal')
	import {onEventClick} from "./shared-function/on-event-click";
	import {eventDidMount} from "./shared-function/event-did-mount";
	import ToggleViewMenu from "./toggle-view-menu.svelte"
	import Icon from "../ui-elements/icon.svelte"
	import {tutor_store} from "../../store/tutor-store";
	import {fetchZoomMaterial} from "../../api/zoom-api";

	export let tutor_id

	let events
	let calendar
	let calendar_el

	$: {
		if (tutor_id) fetchData()
	}

	const fetchData = async () => {
		let start_time = dayjs().subtract(1, 'month').format('YYYY-MM-DD') + ' 00:00:00'
		let end_time = dayjs().add(3, 'months').format('YYYY-MM-DD') + ' 00:00:00'

		let p1 = fetchTutorSchedule({
			start_time,
			end_time,
			teacher_ids: [tutor_id]
		})
		let p2 = fetchZoomMaterial({
			start_date: start_time,
			end_date: end_time,
			teacher_ids: [tutor_id]
		})
		let [data, data2] = await Promise.all([p1,p2])
		data[0].zoom_time.forEach(z => {
			data2.forEach(_z => {
				if (z.zoom_id == _z.wrapper_id) {
					z.days = _z.days
					z.big_classroom_type = _z.big_classroom_type
				}
			})
		})

		events = convertToEvents(data[0])
		renderCalendar()
	}

	const renderCalendar = () => {
		if (calendar) calendar.destroy()
		calendar = new FullCalendar.Calendar(calendar_el, {
			height: "calc(100vh - 180px)",
			initialView: 'timeGridWeek',
			events,
			eventClassNames: ['overflow-hidden', 'cursor-pointer'],
			slotMinTime: '08:00:00',
			slotMaxTime: '23:00:00',
			scrollTimeReset: false,
			expandRows: true,
			allDaySlot: false,
			headerToolbar: false,
			eventContent,
			eventDidMount,
			eventClick: ({event, el}) => {
				onEventClick({event, el}, openPopper, openModal, calendar, null, tutor_id)
			}
		})
		calendar.render()
	}

	const onNextWeek = () => {
		calendar.next()
	}

	const onPrevWeek = () => {
		calendar.prev()
	}
</script>

<div class="flex items-center h-16">
	<div class="flex-1 flex items-center justify-between px-8">
		<button class="transform rotate-180 w-12 h-12 hover:bg-blue-500 hover:text-white rounded-full bg-gray-100 border border-gray-300 flex items-center justify-center" on:click={onPrevWeek}>
			<Icon className="w-4" name="right"/>
		</button>
		<div class="flex-1 flex items-center justify-center" style="font-size: 1.8em">
			<p class="font-bold">{tutor_store.getTutorName(tutor_id)}</p>
		</div>
		<button class="w-12 h-12 hover:bg-blue-500 hover:text-white rounded-full bg-gray-100 border border-gray-300 flex items-center justify-center" on:click={onNextWeek}>
			<Icon className="w-4" name="right"/>
		</button>
	</div>
	<div class="w-96 ml-4 h-full flex items-center justify-end pr-4">
		<ToggleViewMenu {tutor_id} active_menu="week"/>
	</div>
</div>

<div bind:this={calendar_el}></div>