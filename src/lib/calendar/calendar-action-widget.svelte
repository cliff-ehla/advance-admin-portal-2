<script>
	import Icon from '../../lib/ui-elements/icon.svelte'
	import TimePicker from '../../lib/ui-elements/time-picker-2.svelte'
	import Dropdown from '../../lib/ui-elements/dropdown3.svelte'
	import {action_status, calendar_store} from "../../store/calendar-action-status-store";
	import {course_lesson_tbc_selection, edit_lesson_tbc_to_date, course_start_hh_mm, course_end_hh_mm, editing_option} from "../../store/calendar-action-status-store";
	import {getContext} from 'svelte'
	const {openModal} = getContext('simple-modal')
	import CreateCourseDialog from '../reservation/create-course-dialog.svelte'
	import ConfirmOptionDialog from "../reservation/trial-option-confirm-dialog.svelte";
	import ConfirmLeaveDialog from "../reservation/confirm-leave-dialog.svelte";
	import CreateBigClassDialog from "$lib/classroom/create-big-class-dialog.svelte";
	import CreateTrialLessonDialog from "$lib/option/create-trial-lesson.dialog.svelte";
	import dayjs from "dayjs";
	import {createZoom} from "../../api/zoom-api";
	import {http} from "$lib/http.js";
	import {createEventDispatcher} from 'svelte'
	import {student_store} from "../../store/student-store.js";
	const dispatch = createEventDispatcher()
	import {page} from "$app/stores";

	let loading
	$: computed_status = $action_status || $calendar_store.status

	const onExit = () => {
		course_lesson_tbc_selection.reset()
		edit_lesson_tbc_to_date.set({})
		action_status.set('')
		calendar_store.clear()
		dispatch('clearTBC')
	}

	const onOpenCourseConfirmDialog = () => {
		if ($course_lesson_tbc_selection.length) {
			openModal(CreateCourseDialog)
		}
	}

	const onOpenOptionConfirmDialog = () => {
		if (!$course_lesson_tbc_selection.length) return
		openModal(ConfirmOptionDialog, {}, {
			styleWindow: {
				width: '680px',
				borderRadius: '0.5em'
			},
			styleContent: {
				padding: 0,
				borderRadius: '0.5em'
			},
		})
	}

	const onOpenTrialLessonConfirmDialog = () => {
		if (!$course_lesson_tbc_selection.length) return
		let reserve = $course_lesson_tbc_selection[0]
		openModal(CreateTrialLessonDialog, {
			start_date: dayjs(reserve.start_date).utc().format('YYYY-MM-DD HH:mm:ss'),
			end_date: dayjs(reserve.end_date).utc().format('YYYY-MM-DD HH:mm:ss'),
			onSuccess: () => {
				dispatch('refresh')
			}
		}, {
			closeButton: false,
			width: '960px'
		})
	}

	const onOpenCreateBigClassDialog = () => {
		openModal(CreateBigClassDialog, {
			onSuccess: () => {
				dispatch('refresh')
			},
			teacher_id: $page.params.user_id
		}, {
			overflow: 'initial'
		})
	}

	const onOpenConfirmLeaveDialog = () => {
		if (!$course_lesson_tbc_selection.length) return
		openModal(ConfirmLeaveDialog, {}, {
			styleWindow: {
				width: '680px',
				borderRadius: '0.5em'
			},
			styleContent: {
				padding: 0,
				borderRadius: '0.5em'
			},
		})
	}

	const onConfirmEditTime = async () => {
		let d = $edit_lesson_tbc_to_date
		let duration = dayjs(d.to_end_date).diff(dayjs(d.to_start_date), 'minute')
		await http.post(fetch, '/zoomApi/edit_zoom', {
			wrapper_id: d.wrapper_id,
			tutor_group_id: d.tutor_group_id,
			duration,
			teacher_id: d.teacher_id,
			title: d.title,
			start_date: dayjs(d.to_start_date).utc().format('YYYY-MM-DD HH:mm:ss'),
			end_date: dayjs(d.to_end_date).utc().format('YYYY-MM-DD HH:mm:ss')
		}, {
			notification: 'Edit time success'
		})
		action_status.set('')
		calendar_store.clear()
		edit_lesson_tbc_to_date.set({})
		dispatch('refresh')
	}

	const onConfirmAddZoom = async () => {
		let d = $edit_lesson_tbc_to_date
		let duration = dayjs(d.to_end_date).diff(dayjs(d.to_start_date), 'minute')
		let payload = {
			tutor_group_id: d.tutor_group_id,
			teacher_id: d.teacher_id,
			title: d.title,
			start_date: dayjs(d.to_start_date).utc().format('YYYY-MM-DD HH:mm:ss'),
			duration
		}
		loading = true
		await createZoom(payload)
		loading = false
		action_status.set('')
		calendar_store.clear()
		edit_lesson_tbc_to_date.set({})
		dispatch('refresh')
	}
</script>
{#if computed_status}
	<div class="bg-blue-700 h-12 flex items-center justify-center text-white fixed inset-0 top-0 z-50">
		{#if computed_status === 'create_course'}
			<span class="font-bold uppercase">Create Course for: {student_store.getStudentName($calendar_store.student_id)}</span>
		{/if}
		{#if computed_status === 'create_trial'}
			<span class="font-bold uppercase">Create trial lesson for {student_store.getStudentName($calendar_store.student_id)}</span>
		{/if}

		{#if computed_status === 'create_option'}
			{#if $editing_option.grouper_id}
				<span>Add option to</span>
				<span class="font-bold ml-1">{$editing_option.phone}</span>
			{:else}
				<span class="font-bold uppercase">Create Option: </span>
				<span>Select a date and click on the day-calendar to create option</span>
			{/if}
		{/if}
		{#if computed_status === 'edit_time'}
			<p class="font-bold">Edit {$edit_lesson_tbc_to_date.event_title}
				from {dayjs($edit_lesson_tbc_to_date.from_start_date).format('DD MMM h:mm a')}
				To: {dayjs($edit_lesson_tbc_to_date.to_start_date).format('DD MMM h:mm a')}
			</p>
		{/if}
		{#if computed_status === 'add_zoom_to_tutor_group'}
			<p>Add zoom to tutor group <span class="font-bold">{$edit_lesson_tbc_to_date.title} ({$edit_lesson_tbc_to_date.tutor_group_id})</span></p>
		{/if}
		{#if computed_status === 'create_leave'}
			<p>Create Leave</p>
		{/if}
		{#if computed_status === 'create_big_class'}
			<p class="font-bold">建立大課堂</p>
		{/if}
		{#if computed_status === 'batch_create_big_class'}
			Batch建立大課堂: 請Click一個起始日子
		{/if}
		{#if computed_status === 'create_multiple_big_class'}
			<p>Batch建立大課堂</p>
		{/if}
	</div>
{/if}

{#if !!($action_status || $calendar_store.status)}
	<div class="flex items-center bg-blue-100 h-full mr-2">
		<div class="flex-1 px-4 relative">
			{#if loading}
				<div class="absolute inset-0 bg-black text-white bg-opacity-50 flex items-center justify-center">
					loading
				</div>
			{/if}
			{#if $calendar_store.status === 'create_course'}
				<div class="flex items-center">
					<div class="flex">
						<div>
							<p style="font-size: 10px" class="font-bold px-1">Start</p>
							<TimePicker on:hide-overlay on:show-overlay hh_mm={$course_start_hh_mm} on:input={e => {course_start_hh_mm.set(e.detail)}}/>
						</div>
						<div class="ml-1">
							<p style="font-size: 10px" class="font-bold px-1">End</p>
							<TimePicker on:hide-overlay on:show-overlay hh_mm={$course_end_hh_mm} on:input={e => {course_end_hh_mm.set(e.detail)}}/>
						</div>
					</div>
					<div class="ml-1">
						<p style="font-size: 10px" class="font-bold px-1">Create course:</p>
						<button on:click={onOpenCourseConfirmDialog} class="ml-2 pl-4 pr-2 py-1 rounded bg-blue-600 hover:bg-blue-500 text-white flex items-center">
							{$course_lesson_tbc_selection.length} lessons
							<Icon name="right" className="w-4 ml-2"/>
						</button>
					</div>
				</div>
			{/if}
			{#if $action_status === 'create_option'}
				<p class="font-bold text-xs mb-1">Create trial option(s)</p>
				<button on:click={onOpenOptionConfirmDialog} class="pl-4 pr-2 py-1 rounded bg-yellow-500 hover:bg-yellow-700 text-white flex items-center">
					{$course_lesson_tbc_selection.length} selected
					<Icon name="right" className="w-4 ml-2"/>
				</button>
			{/if}
			{#if $action_status === 'create_leave'}
				<p class="font-bold text-xs mb-1">Create leave</p>
				<button on:click={onOpenConfirmLeaveDialog} class="pl-4 pr-2 py-1 rounded bg-yellow-500 hover:bg-yellow-700 text-white flex items-center">
					{$course_lesson_tbc_selection.length} selected
					<Icon name="right" className="w-4 ml-2"/>
				</button>
			{/if}
			{#if $calendar_store.status === 'create_trial'}
				<p class="font-bold text-xs mb-1">Create trial lesson</p>
				<button on:click={onOpenTrialLessonConfirmDialog} class="{$course_lesson_tbc_selection.length ? 'bg-yellow-500 hover:bg-yellow-700' : 'bg-gray-300'} pl-4 pr-2 py-1 rounded text-white flex items-center">
					Confirm
					<Icon name="right" className="w-4 ml-2"/>
				</button>
			{/if}
			{#if $action_status === 'create_big_class'}
				<p class="font-bold text-xs mb-1">Create big/small class</p>
				<button on:click={onOpenCreateBigClassDialog} class="{$course_lesson_tbc_selection.length ? 'bg-yellow-500 hover:bg-yellow-700' : 'bg-gray-300'} pl-4 pr-2 py-1 rounded text-white flex items-center">
					Confirm
					<Icon name="right" className="w-4 ml-2"/>
				</button>
			{/if}
			{#if $action_status === 'edit_time'}
				{#if !$edit_lesson_tbc_to_date.teacher_id}
					<div class="absolute inset-0 bg-red-500 text-white p-2 rounded">冇tutor id 改唔到堂的！</div>
				{/if}
				<p class="font-bold text-xs mb-1">Edit: From {dayjs($edit_lesson_tbc_to_date.from_start_date).format('DD MMM h:mm a')} ({$edit_lesson_tbc_to_date.teacher_id})</p>
				<button on:click={onConfirmEditTime} class="{$edit_lesson_tbc_to_date.to_start_date ? 'bg-yellow-500 hover:bg-yellow-700' : 'bg-gray-300'} pl-4 pr-2 py-1 rounded text-white flex items-center">
					To: {dayjs($edit_lesson_tbc_to_date.to_start_date).format('DD MMM h:mm a')}
				</button>
			{/if}
			{#if $action_status === 'add_zoom_to_tutor_group'}
				<p class="font-bold text-xs mb-1">Add zoom to: {$edit_lesson_tbc_to_date.title} ({$edit_lesson_tbc_to_date.tutor_group_id})</p>
				<button on:click={onConfirmAddZoom} class="{$edit_lesson_tbc_to_date.to_start_date ? 'bg-yellow-500 hover:bg-yellow-700' : 'bg-gray-300'} pl-4 pr-2 py-1 rounded text-white flex items-center">
					{dayjs($edit_lesson_tbc_to_date.to_start_date).format('DD MMM hh:mm a')}
				</button>
			{/if}
		</div>
		<button on:click={onExit} class="bg-blue-700 hover:bg-red-500 text-white w-12 h-16 flex items-center justify-center">
			<Icon name="close" className="w-4"/>
		</button>
	</div>
{:else}
	<div class="flex items-center h-full justify-end">
		<Dropdown placement="bottom-end" caveat_visible activator_active_style="bg-blue-100 text-white" activator_style="rounded border border-blue-300 text-blue-500 px-2 h-10 flex items-center justify-center">
			<button slot="activator" class="flex items-center">
				<Icon name="add" className="w-4"/>
				<p class="ml-2">Create</p>
			</button>
			<div class="bg-white shadow-lg border border-gray-300 w-40 py-2">
				<div on:click={() => {action_status.set('create_option')}} class="cursor-pointer px-4 py-2 hover:text-blue-500 hover:bg-gray-100">
					Options
				</div>
				<div on:click={() => {action_status.set('create_big_class')}} class="cursor-pointer px-4 py-2 hover:text-blue-500 hover:bg-gray-100">
					建立大課堂
				</div>
				<div on:click={() => {action_status.set('batch_create_big_class')}} class="cursor-pointer px-4 py-2 hover:text-blue-500 hover:bg-gray-100">
					Batch建立大課堂
				</div>
				<div on:click={() => {action_status.set('create_leave')}} class="cursor-pointer px-4 py-2 hover:text-blue-500 hover:bg-gray-100">
					Create leave
				</div>
			</div>
		</Dropdown>
	</div>
{/if}