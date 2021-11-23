<script>
	import { Calendar } from '@fullcalendar/core';
	import timeGridPlugin from '@fullcalendar/timegrid';
	import interactionPlugin from '@fullcalendar/interaction';
	import dayGridPlugin from '@fullcalendar/daygrid';
	import dayjs from "dayjs";

	// export let lessons
	// export let reservations
	// export let vacations

	export let events

	let calendar

	const renderCalendar = (node) => {
		let computed_events = events.map(l => ({
			start: dayjs(l.start_time, 'YYYY-MM-DD HH:mm:ss').toDate(),
			end: dayjs(l.end_time, 'YYYY-MM-DD HH:mm:ss').toDate(),
			title: l.title,
			display: 'block',
			backgroundColor: l.type === 'vacation' ? 'gray' : l.type === 'reservation' ? 'orange' : 'blue'
		}))

		calendar = new Calendar(node, {
			plugins: [dayGridPlugin, timeGridPlugin, interactionPlugin],
			initialView: 'dayGridMonth',
			headerToolbar: {
				start: 'title',
				center: 'timeGridWeek,dayGridMonth',
				end: 'prev,today,next'
			},
			events: computed_events,
			selectable: true,
			selectMirror: true,
			editable: true,
			eventStartEditable: true,
			select: e => {
				// TODO: see if the day is emptyy or not
				console.log(e)
				let new_event = {
					title: 'vacation',
					start: e.start,
					end: e.end
				}
				calendar.addEventSource([new_event])
				save()
			},
			eventClick: e => {
				e.event.remove()
				save()
			},
			eventDragStop: e => {
				save()
			},
			eventResizeStop: e => {
				save()
			},
			allDaySlot: false
		})
		calendar.render()
	}

	const save = () => {

	}
</script>

<div use:renderCalendar></div>