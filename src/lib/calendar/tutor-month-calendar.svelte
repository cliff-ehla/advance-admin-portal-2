<script>
	import {tutor_event_store} from "$lib/store/tutor-event-store.js";
	import {createEventDispatcher, getContext} from "svelte";
	import dayjs from "dayjs";
	import {eventContent} from "./shared-function/event-content";
	import {eventDidMount} from "./shared-function/event-did-mount";
	import {onEventDrop} from "./shared-function/on-event-drop";
	import Icon from '../ui-elements/icon.svelte'
	import {tutor_store} from "../../store/tutor-store";
	import {onEventClick} from "./shared-function/on-event-click";
	import {onReservationSlotSelect} from "./shared-function/on-reservation-slot-select";
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

	const {openPopper} = getContext('popper')
	const {openModal} = getContext('simple-modal')

	export let YYYY_MM
	export let tutor_id

	const EVENT_SOURCE_ID = 'individual'
	let events
	let selected_date = dayjs(YYYY_MM, 'YYYY-MM').startOf('month').toDate()
	let loading
	let disabled

	let day_calendar
	let month_calendar

	const dispatch = createEventDispatcher()

	$: {
		if (tutor_id && day_calendar && month_calendar) onTutorChange()
	}
	$: tutor_name = $tutor_store ? tutor_store.getTutorName(tutor_id) : ''

	const onTutorChange = () => {
		clearSources()
		addSourcesToMonthCalendar()
		addSourcesToDayCalendar()
	}

	const clearSources = () => {
		const calendars = [month_calendar, day_calendar]
		calendars.forEach(c => {
			let source = c.getEventSourceById(EVENT_SOURCE_ID)
			if (source) source.remove()
		})
	}

	const addSourcesToMonthCalendar = () => {
		const month_view_events = tutor_event_store.getTutorEvents(tutor_id, {
			is_grid_view: true
		})
		month_calendar.addEventSource({
			id: EVENT_SOURCE_ID,
			events: month_view_events
		})
	}

	const addSourcesToDayCalendar = () => {
		const day_view_events = tutor_event_store.getTutorEvents(tutor_id)
		day_calendar.addEventSource({
			id: EVENT_SOURCE_ID,
			events: day_view_events
		})
	}

	const fetchData = async () => {
		// TODO get temp event from store
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
		if ($action_status !== 'create_option') {
			events = events.filter(e => e.extendedProps.type !== 'ff_reserved')
		}
		// renderMonthCalendar([...events, ...temp_events, ...temp_edit_event])
		// renderTimeCalendar([...events, ...temp_events, ...temp_edit_event])
	}

	const initMonthCalendar = (node) => {
		month_calendar = new FullCalendar.Calendar(node, {
			initialView: 'dayGridMonth',
			dayMaxEventRows: true,
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
		addSourcesToMonthCalendar()
	}

	const initTimeCalendar = (node) => {
		day_calendar = new FullCalendar.Calendar(node, {
			events: $tutor_event_store[tutor_id], // TODO single get event place
			initialView: 'timeGridOneDay',
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
		addSourcesToDayCalendar
	}

	const onChangeMonth = (type) => {
		if (type === 'next') {
			selected_date = dayjs(selected_date).add(1, 'month')
		} else {
			selected_date = dayjs(selected_date).subtract(1, 'month')
		}
		// const _YYYY_MM = dayjs(selected_date).format('YYYY-MM')
		// dispatch('monthChange', _YYYY_MM)
		if (type === 'next') {
			month_calendar.next()
		} else {
			month_calendar.prev()
		}
	}

	const onShowStudentClick = () => {
		openModal(StudentListDialog, {
			tutor_id
		})
	}
</script>

<div class="flex items-center h-16">
	<div class="flex-1 flex items-center justify-between px-2">
		<button class="transform rotate-180 w-12 h-12 hover:bg-blue-500 hover:text-white rounded-full bg-gray-100 border border-gray-300 flex items-center justify-center" on:click={() => {onChangeMonth('prev')}}>
			<Icon className="w-4" name="right"/>
		</button>
		<div class="flex-1 flex items-center justify-center" style="font-size: 1.6em">
			<img src={tutor_store.getTutorProfilePic(tutor_id)} alt={tutor_name} class="w-12 h-12 rounded-full mr-2">
			<p class="font-bold leading-none">{tutor_name}</p>
			<p class="ml-2 leading-none">{dayjs(selected_date).format('MMMM YYYY')}</p>
		</div>
		<button class="w-12 h-12 hover:bg-blue-500 hover:text-white rounded-full bg-gray-100 border border-gray-300 flex items-center justify-center" on:click={() => {onChangeMonth('next')}}>
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
		{#if $action_status === 'create_trial'}
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