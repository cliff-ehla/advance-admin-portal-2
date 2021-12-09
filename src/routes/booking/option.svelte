<script context="module">
	import {http, onFail} from "$lib/http";

	export const load = async ({page, fetch}) => {
		const {data, success, debug} = await http.post(fetch, '/zoomApi/list_zoom_trial_option')
		if (!success) return onFail(debug)
		return {
			props: {
				option_list: data
			}
		}
	}
</script>

<script>
	import dayjs from "dayjs";
	import utc from "dayjs/plugin/utc.js";
	dayjs.extend(utc)
	import {tutor_store} from "../../store/tutor-store";
	import {dialog} from "$lib/store/dialog";
	import Icon from "$lib/ui-elements/icon.svelte";
	import OptionDraftDialog from '$lib/reservation/option-draft-dialog.svelte'
	import {getContext} from 'svelte'
	const {openModal} = getContext('simple-modal')

	export let option_list
	$: not_yet_locked_list = option_list.filter(item => !!item.auto_delete_date)
	$: locked_list = option_list.filter(item => !item.auto_delete_date)

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
			onSuccess: async () => {
				let {data} = await http.post(fetch, '/zoomApi/list_zoom_trial_option')
				option_list = data
			}
		})
	}

	const openDraftDialog = (option) => {
		openModal(OptionDraftDialog)
	}
</script>

<div class="max-w-screen-lg px-4 py-8 bg-gray-100">
	<div class="flex">
		<div class="w-80">
			<p class="font-bold mb-4">未確定的時段</p>
			<div class="grid gap-4">
				{#each not_yet_locked_list as option}
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
								<p class="text-sm text-gray-700 border-b border-gray-300 mb-2">預約時段選擇:</p>
								{#each option.reserves as slot}
									<div class="flex items-center mb-1 text-sm">
										<a href="/tutor/{slot.teacher_id}/{dayjs().format('YYYY-MM')}">
											<img src={tutor_store.getTutorProfilePic(slot.teacher_id)} class="w-8 h-8 rounded-full" title={tutor_store.getTutorName(slot.teacher_id)}>
										</a>
										<div class="ml-2 leading-none">
											<p class="font-bold leading-none">{dayjs.utc(slot.start_date).local().format('DD MMM (ddd)')}</p>
											<p class="text-sm leading-none">{dayjs.utc(slot.start_date).local().format('h:mma')} - {dayjs.utc(slot.end_date).local().format('h:mma')}</p>
										</div>
										<div class="ml-auto">
											<button on:click={() => lockOption(slot)} className="button-secondary w-12">確定</button>
										</div>
									</div>
								{/each}
								<div class="text-xs mt-2">
									<p>備忘: {option.general_message || option.remark} <button class="button-secondary">修改</button></p>
									<p>建立者: {option.username}</p>
								</div>
							</div>
						</div>
					</div>
				{/each}
			</div>
		</div>
		<div class="flex-1 ml-4">
			<p class="font-bold mb-4">確定的時段</p>
			<div class="grid gap-4 grid-cols-2 w-full">
				{#each locked_list as option}
					<div class="border border-gray-300 rounded-lg bg-white px-2 pb-2 pt-4">
						<div class="flex items-center justify-center mx-auto mb-2">
							<div on:click={() => {openDraftDialog(option)}} class="relative w-16 text-center overflow-hidden flex-shrink-0 p-1 rounded {!option.student_id ? 'border border-transparent hover:bg-blue-50 hover:shadow-lg hover:border-blue-300 cursor-pointer' : ''}">
								<img src="{option.student_id ? '/student-f-icon.jpg' : option.s_nickname ? '/pre-user-icon.png' : '/phone-icon.png'}" alt="student"
								     class="rounded-full w-12 h-12 mx-auto border border-gray-500">
								<p class="font-bold text-center mt-1.5 text-xs whitespace-nowrap">
									{#if option.student_id}
										{option.student_nickname}
									{:else}
										{option.s_nickname || option.phone}
										<button class="absolute top-0 right-0 cc bg-blue-500 text-white rounded-full w-6 h-6">
											<Icon name="edit" className="w-3"/>
										</button>
									{/if}
								</p>
							</div>
							<div class="ml-4 w-16 text-center overflow-hidden flex-shrink-0">
								<img src="{tutor_store.getTutorProfilePic(option.reserves[0].teacher_id)}" alt="student"
								     class="rounded-full w-12 h-12 mx-auto border border-gray-500">
								<p class="font-bold text-center mt-1.5 text-xs whitespace-nowrap">
									{tutor_store.getTutorName(option.reserves[0].teacher_id)}
								</p>
							</div>
						</div>
						<div>
							<div class="p-2 text-center leading-none border border-gray-300 rounded bg-blue-50">
								<p class="font-bold leading-none">{dayjs.utc(option.reserves[0].start_date).local().format('DD MMM (ddd)')}</p>
								<p class="text-sm leading-none">{dayjs.utc(option.reserves[0].start_date).local().format('h:mma')} - {dayjs.utc(option.reserves[0].end_date).local().format('h:mma')}</p>
							</div>
							<div class="text-xs mt-2">
								<p>備忘: {option.general_message || option.remark} <button class="button-secondary">修改</button></p>
							</div>
							{#if option.student_id}
								<button class="button">Create {option.course}</button>
							{/if}
						</div>
					</div>
				{/each}
			</div>
		</div>
	</div>
</div>
