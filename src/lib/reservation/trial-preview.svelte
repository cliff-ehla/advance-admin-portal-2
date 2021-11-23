<script>
	import dayjs from "dayjs";
	import {setZoomTrialStatus, setMessageIsSent} from "../../api/zoom-api";
	import {createEventDispatcher, getContext} from 'svelte'
	const dispatch = createEventDispatcher()
	import {create_course_from_trial_store} from "../../store/create-course-from-trial-store";
	import {action_status} from "../../store/calendar-action-status-store";
	import {goto} from '$app/navigation'
	import utc from "dayjs/plugin/utc.js";
	import timezone from "dayjs/plugin/timezone.js";
	import {course_start_hh_mm, course_end_hh_mm} from "../../store/calendar-action-status-store";
	import {trial_lesson_retry_student_id} from "../../store/calendar-action-status-store";
	import Dropdown from '../../lib/ui-elements/dropdown3.svelte'
	import Icon from '../../lib/ui-elements/icon.svelte'
	import {tutor_store} from "../../store/tutor-store";
	import WhatsappDialog from './whatsapp-message-dialog.svelte'

	dayjs.extend(utc)
	dayjs.extend(timezone)
	const {openModal} = getContext('simple-modal')

	export let t
	let loading = false

	let is_active = dayjs.utc(t.start_date).isBefore(dayjs())
	let status = !is_active ? 'pending' : t.is_temp_reserved ? 'reserved' : t.is_trial_success ? 'success' : 'active'
	let map = {
		active: 'text-blue-500',
		reserved: 'text-green-500',
		success: 'text-green-500',
		pending: 'text-gray-400'
	}

	const onFailClick = async () => {
		loading = true
		await setZoomTrialStatus({
			wrapper_id: t.wrapper_id,
			is_trial_success: false
		})
		dispatch('fail')
	}

	const onOk = async () => {
		loading = true
		await setZoomTrialStatus({
			wrapper_id: t.wrapper_id,
			is_trial_success: true
		})
		dispatch('fail')
	}
	
	const onCreateCourse = () => {
		create_course_from_trial_store.set(t)
		action_status.set('create_course')
		let start = dayjs.utc(t.start_date).tz('Asia/Hong_Kong')
		let end = start.add(t.duration, 'minute')
		course_start_hh_mm.set(start.format('HH:mm'))
		course_end_hh_mm.set(end.format('HH:mm'))
		goto(`/tutor/${t.teacher_id}/${dayjs().format('YYYY-MM')}`)
	}

	const onRetryClick = (tutor) => {
		action_status.set('create_trial_lesson')
		const stduent_id = t.students[0].user_id
		trial_lesson_retry_student_id.set(stduent_id)
		console.log('stduent_id', stduent_id)
		goto(`/tutor/${tutor.user_id}/${dayjs().format('YYYY-MM')}`)
	}

	const onListMsg = () => {
		openModal(WhatsappDialog, {
			wrapper_id: t.wrapper_id
		})
	}

	const onMarkMsgSent = async () => {
		await setMessageIsSent({
			wrapper_id: t.wrapper_id,
			is_msg_sent: true
		})
		dispatch('fail')
	}

	const undoMarkMsgSent = async () => {
		await setMessageIsSent({
			wrapper_id: t.wrapper_id,
			is_msg_sent: false
		})
		dispatch('fail')
	}
</script>

<tr class="px-4 border-gray-300 border-b">
	<td class="">
		<p class="font-bold whitespace-nowrap">{dayjs.utc(t.start_date).tz('Asia/Hong_Kong').format('DD MMM YYYY (ddd) h:mma')}</p>
	</td>
	<td class="px-4">
		<div>
			{#each t.students as s}
				<span class="whitespace-nowrap">{s.nickname}</span>
			{/each}
		</div>
	</td>
	<td class="whitespace-nowrap p-4">
		<p><a class="text-blue-500 hover:text-blue-800" href="/tutor/{t.teacher_id}/{dayjs().format('YYYY-MM')}">{t.teacher_nickname}</a></p>
	</td>
	<td>
		<div class="inline-flex items-center border border-current px-4 h-10 rounded {map[status]}">
			<div class="w-2.5 h-2.5 rounded-full bg-current"></div>
			<p class="ml-2 text-sm font-bold uppercase">{status === 'active' ? 'Mark status' : status}</p>
		</div>
	</td>
	<td>
		{#if t.is_msg_sent}
			<Icon name="tick" className="w-6 text-green-500 mx-auto"/>
		{/if}
	</td>
	<td class="flex items-center p-4 justify-end {loading ? 'cursor-not-allowed pointer-events-none opacity-30' : ''}">
		{#if t.is_temp_reserved}

		{:else if t.is_trial_success}
			<button on:click={onCreateCourse} class="px-16 py-1.5 hover:bg-green-400 bg-green-500 text-white rounded">Create course</button>
		{:else if dayjs(t.start_date).isBefore(dayjs())}
			<button on:click={onOk} class="px-2 py-1.5 hover:bg-green-100 border-current border text-blue-500 rounded">Succeed</button>
			<button on:click={onFailClick} class="px-2 py-1.5 hover:bg-green-100 border-current border text-blue-500 rounded ml-2">Gone</button>
			<Dropdown
							caveat_visible
							activator_active_style="bg-blue-100"
							activator_style="px-2 py-1.5 text-blue-500 border-blue-500 border text-white rounded ml-2">
				<button slot="activator" on:click={onRetryClick} class="">Retry</button>
				<div class="bg-white shadow-lg border border-gray-300 rounded text-gray-700 p-2 w-64">
					{#each $tutor_store as tutor}
						<div on:click={() => {onRetryClick(tutor)}} class="cursor-pointer block px-4 py-2 hover:bg-gray-200 hover:text-blue-500">{tutor.nickname}</div>
					{/each}
				</div>
			</Dropdown>
		{:else}
			{#if !t.is_msg_sent}
				<button on:click={onMarkMsgSent} class="px-2 py-1.5 hover:text-blue-800 hover:bg-blue-100 border-blue-500 border text-blue-500 rounded">Mark message sent</button>
			{:else}
				<button on:click={undoMarkMsgSent} class="px-2 py-1.5 hover:text-blue-800 hover:bg-blue-100 border-blue-500 border text-blue-500 rounded">Undo msg sent</button>
			{/if}
			<button on:click={onListMsg} class="ml-4 w-10 h-10 items-center justify-center flex hover:bg-gray-200 rounded-full">
				<Icon name="message" className="w-6 text-green-500"/>
			</button>
		{/if}
	</td>
</tr>