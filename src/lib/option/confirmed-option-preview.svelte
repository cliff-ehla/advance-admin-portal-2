<script>
	import dayjs from "dayjs";
	import utc from "dayjs/plugin/utc.js";
	dayjs.extend(utc)
	import {tutor_store} from "../../store/tutor-store";
	import Icon from "$lib/ui-elements/icon.svelte";
	import OptionDraftDialog from '$lib/reservation/option-draft-dialog.svelte'
	import CreateTrialDialog from '$lib/option/create-trial-lesson.dialog.svelte'
	import {getContext} from 'svelte'
	import {goto} from "$app/navigation";

	const {openModal, closeModal} = getContext('simple-modal')

	export let option
	$: date_display = dayjs.utc(option.reserves[0].start_date).local().format('DD MMM (ddd)')
	$: time_display = dayjs.utc(option.reserves[0].start_date).local().format('h:mma') + ' - ' + dayjs.utc(option.reserves[0].end_date).local().format('h:mma')

	const openDraftDialog = () => {
		openModal(OptionDraftDialog)
	}

	const openCreatDialog = () => {
		openModal(CreateTrialDialog, {
			student_name: option.student_nickname,
			teacher_name: tutor_store.getTutorName(option.reserves[0].teacher_id),
			teacher_profile_pic: tutor_store.getTutorProfilePic(option.reserves[0].teacher_id),
			date_display,
			time_display,
			reserved_id: option.reserves[0].reserved_id,
			onSuccess: () => {
				goto(`/tutor/${option.reserves[0].teacher_id}`)
			}
		}, {
			width: '900px'
		})
	}
</script>

<div class="border border-gray-300 rounded-lg bg-white">
	<div class="flex items-center justify-center mx-auto mt-4 mb-2">
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
	<div class="px-2">
		<div class="p-2 text-center leading-none border border-gray-300 rounded bg-blue-50 relative">
			<p class="font-bold leading-none">{date_display}</p>
			<p class="text-sm leading-none">{time_display}</p>
			{#if option.student_id}
				<button on:click={openCreatDialog} class="bg-blue-500 hover:bg-blue-700 text-white px-2 rounded absolute right-1 top-1 bottom-1">起堂</button>
			{/if}
		</div>
	</div>
	<div class="border-t border-gray-300 text-xs mt-2 bg-gray-50 rounded-b-lg px-2 flex items-center py-0.5">
		<p>{option.remark}</p>
		<div class="ml-auto"><button><Icon name="edit" className="w-2.5"/></button></div>
	</div>
</div>