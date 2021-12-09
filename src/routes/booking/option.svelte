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
	import ConfirmedOptionPreview from '$lib/option/confirmed-option-preview.svelte'


	export let option_list
	$: not_yet_locked_list = option_list.filter(item => !!item.auto_delete_date)
	$: locked_list = option_list.filter(item => !item.auto_delete_date && !item.student_id)
	$: ready_list = option_list.filter(item => !!item.student_id)

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
			onSuccess: reloadData
		})
	}

	const reloadData = async () => {
		let {data} = await http.post(fetch, '/zoomApi/list_zoom_trial_option')
		option_list = data
	}
</script>

<div class="bg-gray-100">
	<div class="max-w-screen-lg px-4 py-8">
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
					{/each}
				</div>
			</div>
			<div class="w-80 ml-4">
				<p class="font-bold mb-4">確定的時段</p>
				<div class="grid gap-4">
					{#each locked_list as option}
						<ConfirmedOptionPreview on:user_created={reloadData} {option}/>
					{/each}
				</div>
			</div>
			<div class="w-80 ml-4">
				<p class="font-bold mb-4">準備起堂</p>
				<div class="grid gap-4">
					{#each ready_list as option}
						<ConfirmedOptionPreview {option}/>
					{/each}
				</div>
			</div>
		</div>
	</div>
</div>