<script>
	import {getContext} from 'svelte'
	import {convertToEvents, genBookedEventFromZoom} from "./phase-to-events";
	import {eventContent} from "./shared-function/event-content";
	import {eventDidMount} from "./shared-function/event-did-mount";
	import {fetchTutorSchedule} from "../../api/admin-api";
	import {tutor_store} from "../../store/tutor-store";
	import dayjs from "dayjs";


	export let YYYY_MM_DD
	$: {
		if (YYYY_MM_DD) fetchData()
	}

	let tutors_events = []
	let calendar_instances = []
	let render = false
	let time_labels = [8,9,10,11,12,13,14,15,16,17,18,19,20,21,22]
	let time_label_height

	const fetchData = async () => {
		if (calendar_instances.length) {
			calendar_instances.forEach(c => c.destroy())
		}
		tutors_events = []
		render = false
		let teacher_ids = $tutor_store.map(t => t.user_id)

		let start_time = `${YYYY_MM_DD} 00:00:00`
		start_time = dayjs(start_time).utc().format('YYYY-MM-DD HH:mm:ss')
		let end_time = `${YYYY_MM_DD} 23:59:59`
		end_time = dayjs(end_time).utc().format('YYYY-MM-DD HH:mm:ss')

		let data = await fetchTutorSchedule({
			start_time,
			end_time,
			teacher_ids
		})
		data.forEach(tutor => {
			let events = convertToEvents(tutor)
			events.forEach(e => {
				e.extendedProps.tutor_id = tutor.user_id
			})
			tutors_events.push({
				events,
				tutor_id: tutor.user_id
			})
		})
		tutors_events = tutors_events
		render = true
		setTimeout(attachScrollEvent, 10)
		setTimeout(() => {
			getTimeLabelHeight()
		}, 50)
	}

	const getTimeLabelHeight = () => {
		let el = document.querySelector('.fc-timegrid-col')
		console.log(el)
		if (el) {
			let h = el.clientHeight
			time_label_height = Math.abs((h + 3) / time_labels.length)
		}
	}

	const attachScrollEvent = () => {
		let all_scroll_container = document.querySelectorAll('.fc-scroller-liquid-absolute')
		all_scroll_container.forEach(container => {
			container.addEventListener('scroll', e => {
				let scroll_top = container.scrollTop
				all_scroll_container.forEach(el => {
					el.scrollTop = scroll_top
				})
			})
		})
	}

	const renderTimeCalendar = (node, zoom_time) => {
		let calendar = new FullCalendar.Calendar(node, {
			initialView: 'timeGridOneDay',
			events: zoom_time,
			height: 'calc(100vh - 160px)',
			slotMinTime: '08:00:00',
			slotMaxTime: '23:00:00',
			scrollTimeReset: false,
			expandRows: true,
			allDaySlot: false,
			headerToolbar: false,
			views: {
				timeGridOneDay: {
					type: 'timeGrid',
					duration: { days: 1 }
				}
			},
			selectable: true,
			editable: true,
			eventContent,
			eventDidMount
		})
		calendar.render()
		calendar.changeView('timeGridOneDay', YYYY_MM_DD)
		calendar_instances.push(calendar)
	}
</script>

{#if render}

	<div class="flex">
		<div class="w-10 text-center">
			<div class="h-10 border-b border-gray-300"></div>
			{#if time_label_height}
				{#each time_labels as label}
					<p class="border-b border-gray-300 py-0.5"
					   style="height: {time_label_height}px">{label}</p>
				{/each}
			{/if}
		</div>
		<div class="overflow-x-scroll" style="width: calc(100vw - 12.5em)">
			<div class="flex no-day-header no-today-highlight">
				{#if tutors_events.length}
					{#each tutors_events as tutor, i}
						<div class="w-28">
							<a href="/tutor/{tutor.tutor_id}/{dayjs().format('YYYY-MM')}" class="block font-bold py-2 text-center bg-white border hover:bg-blue-500 hover:text-white border-gray-300 overflow-hidden whitespace-nowrap">{tutor_store.getTutorName(tutor.tutor_id)}</a>
							<div class="w-28 no-time-label" use:renderTimeCalendar={tutor.events}></div>
						</div>
					{/each}
				{/if}
			</div>
		</div>
	</div>
{/if}

