<script>
	import dayjs from "dayjs";
	import utc from 'dayjs/plugin/utc.js'
	import {tutor_store} from "../../store/tutor-store";
	import Icon from '../ui-elements/icon.svelte'
	import Dropdown from '../ui-elements/dropdown3.svelte'
	import {createEventDispatcher} from 'svelte'
	import {action_status, editing_option} from "../../store/calendar-action-status-store";
	const dispatch = createEventDispatcher()
	import {goto} from '$app/navigation'
	import {deleteZoomOption, listZoomReserve, lockZoomOption} from "../../api/zoom-api";
	import {editOption} from "../../api/zoom-api";
	import TextInputDialog from '../../lib/ui-elements/text-input-dialog.svelte'
	import {getContext} from 'svelte'
	import ConfirmTrialDialog from "./create-trial-from-option-dialog.svelte";
	import OptionDraftDialog from "./option-draft-dialog.svelte";
	import {student_store} from "../../store/student-store";
	import CopyMessageDialog from './copy-message-dialog.svelte'

	const {openModal} = getContext('simple-modal')

	dayjs.extend(utc)

	export let trial_option
	$: r = trial_option

	$: is_locked = !r.auto_delete_date
	const dialog_option = {
		styleWindow: {
			width: '680px',
			borderRadius: '0.5em'
		},
		styleContent: {
			padding: 0,
			borderRadius: '0.5em'
		},
	}

	const onCancel = () => {
		dispatch('delete')
	}

	const onEditDraft = () => {
		openModal(OptionDraftDialog, {
			grouper_id: r.grouper_id,
			s_nickname: r.s_nickname,
			course: r.course,
			material: r.material,
			age: r.age,
			lv: r.lv,
			gender: r.gender,
			general_message: r.general_message || r.remark,
			is_edit_after_confirm: r.is_confirmed,
			onConfirm: () => {
				goto('/booking/trial-option?status=ready')
				dispatch('update')
			},
			onSaveDraft: () => {
				dispatch('update')
			}
		}, dialog_option)
	}

	const onConfirm = async (slot, reserve) => {
		if (r.is_confirmed || r.student_id) {
			// setup account
			openModal(ConfirmTrialDialog, {
				slot: slot,
				reserve,
				student_id: r.student_id,
				onSuccess: () => {
					goto('/booking/trial-lesson?status=not-confirm')
				}
			}, dialog_option)
		} else if (is_locked) {
			// create draft
			onEditDraft()
		} else {
			// confirm option
			await lockZoomOption({
				reserved_id: slot.reserved_id,
				grouper_id: slot.grouper_id
			})
			dispatch('update')
		}
	}

	const getRemainingTime = (end_time) => {
		end_time = dayjs.utc(end_time).local()
		let now = dayjs()
		let remains = dayjs(end_time).diff(now, 'hour')
		return 72 - remains
	}

	const onAddClick = (tutor) => {
		action_status.set('create_option')
		editing_option.set(trial_option)
		goto(`/tutor/${tutor.user_id}/${dayjs().format('YYYY-MM')}`)
	}

	const onDelete = async (slot) => {
		let reserved_id = slot.reserved_id
		let grouper_id = slot.grouper_id
		let d = await deleteZoomOption({
			reserved_id,
			grouper_id
		})
		dispatch('update')
	}

	const onEditRemark = () => {
		openModal(TextInputDialog, {
			text: trial_option.remark,
			onConfirm: async (text) => {
				await editOption({
					grouper_id: trial_option.grouper_id,
					remark: text,
					phone: trial_option.phone
				})
				dispatch('update')
			}
		})
	}

	const onMessageClick = () => {
		console.log(trial_option)
		let trial_lesson = trial_option.reserves[0]
		const genMessage = () => {
			let line_1 = tutor_store.getTutorName(trial_lesson.teacher_id)
			let line_2 = `${dayjs(trial_lesson.end_date).diff(dayjs(trial_lesson.start_date), 'minute')} min Trial Lesson`
			let line_3 = `HKT: ${dayjs.utc(trial_lesson.start_date).local().format('DD MMM (ddd)@h:mma')} - ${dayjs.utc(trial_lesson.end_date).local().format('h:mma')}`
			let line_4 = `Student: ${trial_option.s_nickname}`
			return line_1 + '\n' + line_2 + '\n' + line_3 + '\n' + line_4
		}
		openModal(CopyMessageDialog, {
			message: genMessage()
		})
	}
</script>

<div class="p-4 bg-gray-100 rounded">
	<div class="flex items-center mb-4">
		<p class="font-bold text-lg bg-blue-500 text-white px-2 py-1 rounded">{r.s_nickname || r.student_nickname || r.phone}</p>
		<p class="text-xs ml-4">
			{#if !is_locked}
				Created <span class="italic border-b border-gray-500">{getRemainingTime(r.auto_delete_date)} hours ago</span> by <span class="italic border-b border-gray-500">{r.username}</span>
			{:else}
				Created by <span class="italic border-b border-gray-500">{r.username}</span>
			{/if}
		</p>
		{#if r.is_confirmed}
			<div class="ml-4">
				<button class="text-green-500" on:click={onMessageClick}>
					<Icon name="message"/>
				</button>
			</div>
		{/if}
		<div class="ml-auto">
			<button class="w-8 h-8 flex items-center justify-center rounded-full hover:bg-white hover:text-red-500" on:click={() => {onCancel(r)}}>
				<Icon name="close" className="w-4"/>
			</button>
		</div>
	</div>
	<div class="flex border-b border-gray-300 mb-4 items-center">
		<p class="text-sm pb-1">Trial options:</p>
		{#if !is_locked}
			<div class="ml-auto">
				<Dropdown
								activator_style="h-8 flex items-center justify-center"
								activator_active_style="text-blue-500" placement="bottom" offset="0" delay={10} caveat_visible>
					<button slot="activator">
						<Icon name="add" className="w-4"/>
					</button>
					<div class="bg-white shadow rounded text-gray-700 p-4 w-64">
						{#each $tutor_store as tutor}
							<div on:click={() => {onAddClick(tutor)}} class="cursor-pointer block px-4 py-2 hover:bg-gray-200 hover:text-blue-500">{tutor.nickname}</div>
						{/each}
					</div>
				</Dropdown>
			</div>
		{/if}
	</div>

	{#each r.reserves as slot}
		<div class="flex items-center mb-1 text-sm">
			<div class="w-8 h-8 rounded-full flex items-center justify-center bg-white border border-gray-300">
				<Icon name="avatar"/>
			</div>
			<a href="/tutor/{slot.teacher_id}/{dayjs().format('YYYY-MM')}" class="font-bold ml-2 text-blue-500">{tutor_store.getTutorName(slot.teacher_id)}</a>
			<div class="ml-4">
				<span class="font-bold">{dayjs.utc(slot.start_date).local().format('DD MMM (ddd)')}</span>,
				{dayjs.utc(slot.start_date).local().format('h:mma')} - {dayjs.utc(slot.end_date).local().format('h:mma')}
			</div>
			<div class="ml-auto flex items-center">
				{#if (r.is_confirmed && !r.student_id)}
					<button class="mr-1 text-xs px-4 py-2 rounded bg-white text-blue-500 text-white hover:text-white hover:bg-blue-500 border-current border" on:click={onEditDraft}>Edit</button>
				{/if}
				<button on:click={() => {onConfirm(slot, r)}} class="text-xs px-4 py-2 rounded bg-white text-blue-500 text-white hover:text-white hover:bg-blue-500 border-current border">
					{(r.is_confirmed && !r.student_id) ? 'Setup Account' : (!r.auto_delete_date && r.student_id) ? 'Create course' : is_locked ? 'Draft'  : 'Confirm'}
				</button>
				{#if !is_locked}
					<div class="ml-1">
						<Dropdown placement="bottom-end" activator_style="w-8 h-8 flex items-center justify-center" activator_active_style="bg-white border border-blue-500 rounded">
							<button slot="activator">
								<Icon name="more" className="w-5"/>
							</button>
							<div class="shadow-lg w-48 bg-white">
								<div on:click={() => {onDelete(slot)}} class="px-4 py-2 cursor-pointer hover:text-red-500">Delete</div>
							</div>
						</Dropdown>
					</div>
				{/if}
			</div>
		</div>
	{/each}
	<div class="flex border-t border-gray-300 mt-4 pt-2 items-center">
		{#if r.remark.trim()}
			<p class="text-xs">
				Remarks: {r.general_message || r.remark}
			</p>
		{:else}
			<p class="text-gray-500 text-sm">No remark</p>
		{/if}
		{#if !r.is_confirmed && !is_locked}
			<button on:click={onEditRemark} class="ml-2 text-xs px-2 py-1 rounded bg-white text-blue-500 text-white hover:text-white hover:bg-blue-500 border-current border">Edit</button>
		{/if}
	</div>
</div>