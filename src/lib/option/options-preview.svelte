<script>
	import {dialog} from "$lib/store/dialog";
	import dayjs from "dayjs";
	import {tutor_store} from "../../store/tutor-store";
	import {http} from "$lib/http";
	import {createEventDispatcher} from "svelte"
	import Icon from '$lib/ui-elements/icon.svelte'
	import {goto} from "$app/navigation";
	import {action_status, editing_option} from "../../store/calendar-action-status-store";

	const dispatch = createEventDispatcher()

	export let option

	const lockOption = (slot) => {
		dialog.confirm({
			title: '確定這個時段?',
			message: `${dayjs.utc(slot.start_date).local().format('DD MMM (ddd)')}`,
			onConfirm: () => {
				return http.post(fetch, '/zoomApi/lock_zoom_trial_option', {
					grouper_id: slot.grouper_id,
					reserved_id: slot.reserved_id
				}, {
					notification: '時段已經確定'
				})
			},
			onSuccess: () => {
				dispatch('reload')
			}
		})
	}

	const onDeleteGrouper = () => {
		dialog.confirm({
			message: '你要Delete嗎？',
			onConfirm: () => {
				return http.post(fetch, '/zoomApi/delete_zoom_reserved_grouper', {
					reserved_grouper_id: option.grouper_id
				})
			},
			onSuccess: () => {
				dispatch('reload')
			}
		})
	}

	const addMoreSlot = () => {
		action_status.set('create_option')
		editing_option.set(option)
		let tutor_id = option.reserves[0].teacher_id
		goto(`/tutor/${tutor_id}/${dayjs().format('YYYY-MM')}`)
	}
</script>

<div class="border border-gray-300 rounded-lg bg-white">
	<div class="flex items-center p-2">
		<div class="w-16 text-center overflow-hidden flex-shrink-0">
			<img src="{option.student_id ? '/student-f-icon.jpg' : '/phone-icon.png'}" alt="student"
			     class="rounded-full w-12 h-12 mx-auto border border-gray-500">
			<p class="font-bold text-center mt-1.5 text-xs whitespace-nowrap">
				{#if option.student_id}
					{option.student_nickname}
				{:else}
					{option.phone}
				{/if}
			</p>
		</div>

		<div class="ml-2 w-full">
			<div class="flex border-b border-gray-300 mb-2 pb-1">
				<p class="text-sm text-gray-700">預約時段選擇:</p>
				<div class="flex ml-auto">
					<button on:click={addMoreSlot} class="hover:text-blue-500">
						<Icon className="w-3" name="add"/>
					</button>
					<button on:click={onDeleteGrouper} class="hover:text-red-500 ml-2">
						<Icon className="w-3" name="close"/>
					</button>
				</div>
			</div>
			{#each option.reserves as slot}
				<div class="flex items-center mb-2 text-sm">
					<a href="/tutor/{slot.teacher_id}/{dayjs().format('YYYY-MM')}">
						<img src={tutor_store.getTutorProfilePic(slot.teacher_id)} class="w-8 h-8 rounded-full" title={tutor_store.getTutorName(slot.teacher_id)}>
					</a>
					<div class="ml-2 leading-none">
						<p class="font-bold leading-none">{dayjs.utc(slot.start_date).local().format('DD MMM (ddd)')}</p>
						<p class="text-sm leading-none">{dayjs.utc(slot.start_date).local().format('h:mma')} - {dayjs.utc(slot.end_date).local().format('h:mma')}</p>
					</div>
					<div class="ml-auto">
						<button on:click={() => lockOption(slot)} class="button-secondary w-12">確定</button>
					</div>
				</div>
			{/each}
			<div class="text-xs mt-2">
				<p>備忘: {option.general_message || option.remark} <button class="button-secondary">修改</button></p>
			</div>
		</div>
	</div>
</div>