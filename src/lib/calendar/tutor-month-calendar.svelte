<script>
	import {createEventDispatcher, getContext} from "svelte";
	import dayjs from "dayjs";
	import {fetchTutorSchedule} from "../../api/admin-api";
	import {fetchZoomMaterial} from "../../api/zoom-api";
	import {convertToEvents} from "./phase-to-events";
	import {eventContent} from "./shared-function/event-content";
	import {eventDidMount} from "./shared-function/event-did-mount";
	import {onEventDrop} from "./shared-function/on-event-drop";
	import Icon from '../ui-elements/icon.svelte'
	import {tutor_store} from "../../store/tutor-store";
	import {onEventClick} from "./shared-function/on-event-click";
	import {onReservationSlotSelect} from "./shared-function/on-reservation-slot-select";
	import {reservation_selection_store} from "../../store/reservation-selection-store";
	import {course_lesson_tbc_selection, action_status, edit_lesson_tbc_to_date, editing_option} from "../../store/calendar-action-status-store";
	import Widget from './calendar-action-widget.svelte'
	import ToggleViewMenu from './toggle-view-menu.svelte'
	import {createCourseOnDateSelect} from "./shared-function/create-course-on-date-select";
	import {genTempSelectEvent, genTempEditEvent} from "./phase-to-events";
	import {syncTempEvents} from "./shared-function/sync-temp-events";
	import {CALENDAR_HEIGHT} from "./shared-function/calendar-height";
	import {create_course_from_trial_store} from "../../store/create-course-from-trial-store";
	import {trial_lesson_retry_student_id} from "../../store/calendar-action-status-store";
	import {student_store} from "../../store/student-store";
	import StudentListDialog from '../student/student-list-dialog.svelte'
	import Dropdown from '../../lib/ui-elements/dropdown3.svelte'
	import {browser} from "$app/env";

	const {openPopper} = getContext('popper')
	const {openModal} = getContext('simple-modal')

	export let YYYY_MM
	export let tutor_id

	let events
	let selected_date = dayjs(YYYY_MM, 'YYYY-MM').startOf('month').toDate()
	let loading
	let disabled

	let day_calendar
	let month_calendar

	const dispatch = createEventDispatcher()

	$: tutor_name = $tutor_store ? tutor_store.getTutorName(tutor_id) : ''

	$: {
		if ((tutor_id || YYYY_MM)) {
			fetchData()
		}
	}

	$: {
		if (($action_status === '') && (month_calendar && day_calendar)) {
			const calendars = [month_calendar, day_calendar]
			let is_exit_edit_mode = false
			calendars.forEach(c => {
				let trial_option_temp_events = c.getEvents().filter(e => e.extendedProps.type === 'trial_option_temp')
				trial_option_temp_events.forEach(e => {
					is_exit_edit_mode = true
					e.remove()
				})
			})
			if (is_exit_edit_mode) fetchData()
		}
	}

	$: {
		if ($action_status === 'edit_time') {
			fetchData()
		}
	}

	const fetchData = async () => {
		if (!browser) return
		events = []
		let start_time = dayjs(YYYY_MM, 'YYYY-MM').startOf('month').subtract(6, 'day').format('YYYY-MM-DD HH:mm:ss')
		let end_time = dayjs(YYYY_MM, 'YYYY-MM').endOf('month').add(6, 'day').format('YYYY-MM-DD HH:mm:ss')
		loading = true
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

		loading = false
		let temp_events = $course_lesson_tbc_selection.filter(s => s.teacher_id === tutor_id).map(s => ({
			start: s.start_date,
			end: s.end_date
		})).map(slot => genTempSelectEvent(slot))

		let temp_edit_event = []
		if ($edit_lesson_tbc_to_date.to_start_date) {
			let s = $edit_lesson_tbc_to_date
			temp_edit_event.push(genTempEditEvent({
				start: s.to_start_date,
				end: s.to_end_date,
				title: s.event_title
			}))
		}
		events = convertToEvents(data[0])
		if ($action_status !== 'create_option') {
			events = events.filter(e => e.extendedProps.type !== 'ff_reserved')
		}
		renderMonthCalendar([...events, ...temp_events, ...temp_edit_event])
		renderTimeCalendar([...events, ...temp_events, ...temp_edit_event])
	}

	const renderMonthCalendar = (events) => {
		let all_events = month_calendar.getEvents()
		if (all_events.length) {
			all_events.forEach(e => e.remove())
		}
		let month_events = JSON.parse(JSON.stringify(events))
		month_events.forEach(e => {
			if (e.extendedProps.type === 'available') {
				let converted_start_date = dayjs(e.start).format('YYYY-MM-DD')
				e.start = converted_start_date
				e.end = null
			}
		})
		month_calendar.addEventSource(month_events)
		let view_month = dayjs(YYYY_MM, 'YYYY-MM').toDate()
		month_calendar.changeView('dayGridMonth', view_month)
	}

	const renderTimeCalendar = (events) => {
		let all_events = day_calendar.getEvents()
		if (all_events.length) {
			all_events.forEach(e => e.remove())
		}
		day_calendar.addEventSource(events)
	}

	const initMonthCalendar = (node) => {
		month_calendar = new FullCalendar.Calendar(node, {
			initialView: 'dayGridMonth',
			dayMaxEventRows: true,
			events: [],
			height: "calc(100vh - 120px)",
			allDaySlot: false,
			selectable: true,
			headerToolbar: false,
			eventOrder: '-title,start,-duration,allDay', // order TBC event first (with title Z)
			eventContent,
			eventDidMount,
			eventClick: ({event, el}) => {
				onEventClick({event, el}, openPopper, openModal, month_calendar, day_calendar, tutor_id, (_selected_date) => {
					selected_date = _selected_date
					dispatch('monthChange', dayjs(_selected_date).format('YYYY-MM'))
				})
			},
			select: e => {
				createCourseOnDateSelect(e, month_calendar, day_calendar, tutor_id)
				// select a day and the day time calendar will show the day details
				day_calendar.changeView('timeGridOneDay', e.start)
				selected_date = e.start
			},
			eventDrop: (e) => {
				onEventDrop({
					e,
					onDrop: (drop_date) => {
						selected_date = drop_date
						day_calendar.changeView('timeGridOneDay', selected_date)
					}
				})
				syncTempEvents(month_calendar, day_calendar, 'edit_temp')
			}
		})
		month_calendar.render()
	}

	const initTimeCalendar = (node) => {
		day_calendar = new FullCalendar.Calendar(node, {
			initialView: 'timeGridOneDay',
			events: [],
			height: CALENDAR_HEIGHT,
			views: {
				timeGridOneDay: {
					type: 'timeGrid',
					duration: { days: 1 }
				}
			},
			allDaySlot: false,
			headerToolbar: false,
			selectable: true,
			editable: true,
			slotMinTime: '08:00:00',
			slotMaxTime: '23:00:00',
			expandRows: true,
			eventContent,
			eventDidMount,
			eventClick: ({event, el}) => {
				onEventClick({event, el}, openPopper, openModal, month_calendar, day_calendar, dispatch, tutor_id, (_selected_date) => {
					selected_date = _selected_date
				})
			},
			select: ({jsEvent, start, end}) => {
				onReservationSlotSelect({jsEvent, start, end}, openPopper, day_calendar, tutor_id, month_calendar)
			},
			eventDrop: (e) => {
				onEventDrop({
					e,
					onDrop: (drop_date) => {
						selected_date = drop_date
					}
				})
				syncTempEvents(day_calendar, month_calendar, 'edit_temp')
			}
		})
		day_calendar.changeView('timeGridOneDay', selected_date)
		day_calendar.render()
	}

	const onNextMonth = () => {
		month_calendar.next()
		selected_date = dayjs(YYYY_MM, 'YYYY-MM-01').add(1, 'month')
		dispatch('monthChange', dayjs(selected_date).format('YYYY-MM'))
	}

	const onPrevMonth = () => {
		month_calendar.prev()
		selected_date = dayjs(YYYY_MM, 'YYYY-MM-01').subtract(1, 'month')
		dispatch('monthChange', dayjs(selected_date).format('YYYY-MM'))
	}

	const onShowStudentClick = () => {
		openModal(StudentListDialog, {
			tutor_id
		})
	}
</script>

{#if events}
	<div class="flex items-center h-16">
		<div class="flex-1 flex items-center justify-between px-8">
			<button class="transform rotate-180 w-12 h-12 hover:bg-blue-500 hover:text-white rounded-full bg-gray-100 border border-gray-300 flex items-center justify-center" on:click={onPrevMonth}>
				<Icon className="w-4" name="right"/>
			</button>
			<div class="flex-1 flex items-center justify-center" style="font-size: 1.6em">
				<p class="font-bold leading-none">{tutor_name}</p>
				<p class="ml-2 leading-none">{dayjs(YYYY_MM).format('MMMM YYYY')}</p>
			</div>
			<button class="w-12 h-12 hover:bg-blue-500 hover:text-white rounded-full bg-gray-100 border border-gray-300 flex items-center justify-center" on:click={onNextMonth}>
				<Icon className="w-4" name="right"/>
			</button>
		</div>
		<div class="ml-4 h-full flex items-center justify-end pr-4">
			<Dropdown activator_style="mr-2 w-8 h-8 rounded-full flex items-center justify-center border border-gray-300">
				<button slot="activator">
					<Icon name="info" className="w-4"/>
				</button>
				<div class="bg-white shadow-lg border border-gray-300 p-4">
					<div class="px-4 text-white rounded mb-1" style="background: #ED16BE">Unlimited class</div>
					<div class="px-4 text-white rounded mb-1" style="background: #9519C0">Big class</div>
					<div class="px-4 text-white rounded mb-1" style="background: #C342B7">Small class</div>
					<div class="px-4 text-white rounded mb-1" style="background: #3357A7">1-on-1</div>
					<div class="px-4 text-white rounded mb-1" style="background: #3E963D">1-on-1 Trial</div>
					<div class="px-4 text-white rounded mb-1" style="background: #B5B5B5">1-on-1 Option</div>
					<div class="px-4 text-white rounded mb-1" style="background: red">1-on-1 Option Locked</div>
					<div class="px-4 text-white rounded mb-1" style="background: #D6C884">1-on-1 Reservation</div>
					<div class="px-4 text-white rounded mb-1" style="background: #b1e4b0">1-on-1 FF reserved</div>
					<div class="px-4 text-white rounded" style="background: black">Tutor's Leave</div>
				</div>
			</Dropdown>
			<button on:click={onShowStudentClick} class="border border-gray-300 w-10 h-10 flex items-center justify-center rounded hover:bg-gray-100 hover:text-blue-500">
				<Icon name="avatar"></Icon>
			</button>
			<button on:click={fetchData} class="border border-gray-300 w-10 h-10 flex items-center justify-center rounded hover:bg-gray-100 hover:text-blue-500 mx-2">
				<Icon name="refresh"></Icon>
			</button>
			<Widget on:hide-overlay={() => {disabled = false}} on:show-overlay={() => {disabled = true}} on:update={fetchData}/>
			<div class="ml-2">
				<ToggleViewMenu {tutor_id} active_menu="month"/>
			</div>
		</div>
	</div>
	{#if $action_status}
		<div class="{!!$action_status ? 'bg-blue-700' : ''} h-12 flex items-center justify-center text-white fixed inset-0 top-0">
			{#if $action_status === 'create_course'}
				<span class="font-bold uppercase">Create Course: </span>
				{#if $create_course_from_trial_store}
					<span class="px-1">for </span>
					<i class="border-b border-current font-bold">{$create_course_from_trial_store.students[0].nickname}</i>
				{:else}
					<span>click on month calendar to create lesson</span>
				{/if}
			{/if}
			{#if $action_status === 'create_option'}
				{#if $editing_option.grouper_id}
					<span>Add option to</span>
					<span class="font-bold ml-1">{$editing_option.phone}</span>
				{:else}
					<span class="font-bold uppercase">Create Option: </span>
					<span>Select a date and click on the day-calendar to create option</span>
				{/if}
			{/if}
			{#if $action_status === 'create_trial_lesson'}
				<span class="font-bold uppercase">Create trial lesson</span>
				{#if $trial_lesson_retry_student_id}
					<span class="ml-1 font-bold">({student_store.getStudentName($trial_lesson_retry_student_id)})</span>
				{/if}
			{/if}
			{#if $action_status === 'edit_time'}
				<p class="font-bold">Edit lesson time</p>
			{/if}
			{#if $action_status === 'add_zoom_to_tutor_group'}
				<p>Add zoom to tutor group <span class="font-bold">{$edit_lesson_tbc_to_date.title} ({$edit_lesson_tbc_to_date.tutor_group_id})</span></p>
			{/if}
			{#if $action_status === 'create_leave'}
				<p>Create Leave</p>
			{/if}
			{#if $action_status === 'create_big_class'}
				<p class="font-bold">Create big/small class</p>
			{/if}
		</div>
	{/if}
	<div class="flex relative">
		{#if loading}
			<div class="absolute z-50 bg-black bg-opacity-20 inset-0 flex items-center justify-center text-white" style="font-size: 3em">Loading...</div>
		{/if}
		{#if disabled}
			<div class="absolute z-50 bg-black bg-opacity-20 inset-0 flex items-center justify-center text-white"></div>
		{/if}
		<div class="flex-1">
			<div use:initMonthCalendar></div>
		</div>
		<div class="w-64 ml-4 no-today-highlight no-day-header">
			<p class="font-bold text-xl py-4 border border-gray-300 text-center whitespace-nowrap">{dayjs(selected_date).format('DD MMM (ddd)')}</p>
			<div use:initTimeCalendar></div>
		</div>
	</div>
{/if}