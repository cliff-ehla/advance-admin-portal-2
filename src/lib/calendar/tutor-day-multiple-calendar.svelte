<script>
	import {onMount} from 'svelte'
	import dayjs from "dayjs";
	import {fetchTutorSchedule} from "../../api/admin-api";
	import {convertToEvents} from "./phase-to-events";
	import {eventContent} from "./shared-function/event-content";
	import Icon from '../../lib/ui-elements/icon.svelte'
	import ToggleViewMenu from './toggle-view-menu.svelte'
	import {tutor_store} from "../../store/tutor-store";
	import {CALENDAR_HEIGHT} from "./shared-function/calendar-height";
	import {eventDidMount} from "./shared-function/event-did-mount";

	export let day = 0
	export let tutor_id
	let dates = []
	let calendars = []
	let time_labels = [8,9,10,11,12,13,14,15,16,17,18,19,20,21,22]
	let time_label_height

	$: {
		if (tutor_id) fetchData()
	}

	$: tutor_name = $tutor_store ? tutor_store.getTutorName(tutor_id) : ''

	const fetchData = async () => {
		let start_date = dayjs().day(day)
		let end_date = start_date.add(10, 'week')
		let data = await fetchTutorSchedule({
			start_time: start_date.format('YYYY-MM-DD 00:00:00'),
			end_time: end_date.format('YYYY-MM-DD 00:00:00'),
			teacher_ids: [tutor_id]
		})
		renderNewData(convertToEvents(data[0]))
		getTimeLabelHeight()
	}

	const getTimeLabelHeight = () => {
		let el = document.querySelector('.fc-timegrid-col')
		if (el) {
			let h = el.clientHeight
			time_label_height = Math.abs((h + 3) / time_labels.length)
		}
	}

	const renderNewData = (events) => {
		if (calendars.length) {
			calendars.forEach(c => {
				let all_events = c.getEvents()
				if (all_events.length) {
					all_events.forEach(e => e.remove())
				}
				c.addEventSource(events)
			})
		}
	}

	const initCalendar = (node, date) => {
		let _calendar = new FullCalendar.Calendar(node, {
			initialView: 'timeGridOneDay',
			height: CALENDAR_HEIGHT,
			views: {
				timeGridOneDay: {
					type: 'timeGrid',
					duration: { days: 1 },
					allDaySlot: false,
					scrollTimeReset: false,
					expandRows: true,
					slotMinTime: '08:00:00',
					slotMaxTime: '23:00:00',
				}
			},
			headerToolbar: false,
			eventContent,
			eventDidMount
		})
		_calendar.changeView('timeGridOneDay', date)
		_calendar.render()
		calendars.push(_calendar)
	}

	onMount(() => {
		for (let i = 0; i <10 ; i++){
		  dates.push(dayjs().day(day).add(i, 'week').toDate())
		}
		dates = dates
	})

	const onNextDay = () => {
		let date = dayjs(dates[0]).add(1, 'day')
		dates = []
		for (let i = 0; i <10 ; i++){
			let new_date = dayjs(date).add(i, 'week').toDate()
			dates.push(new_date)
			calendars[i].changeView('timeGridOneDay', new_date)
		}
	}

	const onPrevDay = () => {
		let date = dayjs(dates[0]).subtract(1, 'day')
		dates = []
		for (let i = 0; i <10 ; i++){
			let new_date = dayjs(date).add(i, 'week').toDate()
			dates.push(new_date)
			calendars[i].changeView('timeGridOneDay', new_date)
		}
	}
</script>

<div class="flex items-center h-16">
	<div class="flex-1 flex items-center justify-between px-8">
		<button class="transform rotate-180 w-12 h-12 hover:bg-blue-500 hover:text-white rounded-full bg-gray-100 border border-gray-300 flex items-center justify-center" on:click={onPrevDay}>
			<Icon className="w-4" name="right"/>
		</button>
		<div class="flex-1 flex items-center justify-center" style="font-size: 1.8em">
			<p class="font-bold">{tutor_name}</p>
			<p class="ml-2">{dayjs(dates[0]).format('dddd')}</p>
		</div>
		<button class="w-12 h-12 hover:bg-blue-500 hover:text-white rounded-full bg-gray-100 border border-gray-300 flex items-center justify-center" on:click={onNextDay}>
			<Icon className="w-4" name="right"/>
		</button>
	</div>
	<div class="w-96 ml-4 h-full pr-4 flex justify-end items-center">
		<ToggleViewMenu {tutor_id} active_menu="day"/>
	</div>
</div>

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
			{#each dates as d, i}
				<div class="w-56">
					<div class="flex font-bold h-10 items-center justify-center text-center bg-white border hover:bg-blue-500 hover:text-white border-gray-300 overflow-hidden whitespace-nowrap">
						{dayjs(d).format('MMM DD')}
					</div>
					<div class="w-56 no-time-label" use:initCalendar={d}></div>
				</div>
			{/each}
		</div>
	</div>
</div>