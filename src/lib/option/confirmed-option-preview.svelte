<script>
	import dayjs from "dayjs";
	import utc from "dayjs/plugin/utc.js";
	dayjs.extend(utc)
	import {tutor_store} from "../../store/tutor-store";
	import {student_store} from "../../store/student-store";
	import Icon from "$lib/ui-elements/icon.svelte";
	import OptionDraftDialog from '$lib/option/option-draft-editor.svelte'
	import CreateTrialDialog from '$lib/option/create-trial-lesson.dialog.svelte'
	import {getContext, createEventDispatcher} from 'svelte'
	import {goto} from "$app/navigation";
	import {dialog} from "$lib/store/dialog";
	import {http} from "$lib/http";
	const dispatch = createEventDispatcher()
	const {openModal, closeModal} = getContext('simple-modal')

	export let option
	$: date_display = dayjs.utc(option.reserves[0].start_date).local().format('DD MMM (ddd)')
	$: time_display = dayjs.utc(option.reserves[0].start_date).local().format('h:mma') + ' - ' + dayjs.utc(option.reserves[0].end_date).local().format('h:mma')

	const openDraftDialog = () => {
		let payload = {
			grouper_id: option.grouper_id,
			s_nickname: option.s_nickname,
			course: option.course,
			material: option.material,
			age: option.age,
			lv: option.lv,
			gender: option.gender,
			general_message: option.general_message,
			parent_mobile: option.phone
		}
		openModal(OptionDraftDialog, {
			...payload,
			onSaveSuccess: (form) => {
				option = {
					...option,
					...form
				}
			},
			onCreateUserSuccess: () => {
				dispatch('reload')
			}
		})
	}

	const openCreateDialog = () => {
		openModal(CreateTrialDialog, {
			student_id: option.student_id,
			teacher_id: option.reserves[0].teacher_id,
			course_title: option.course,
			start_date: option.reserves[0].start_date,
			end_date: option.reserves[0].end_date,
			reserved_id: option.reserves[0].reserved_id,
			onSuccess: () => {
				goto(`/tutor/${option.reserves[0].teacher_id}/${dayjs.utc(option.reserves[0].start_date).local().format('YYYY-MM')}`)
			}
		}, {
			width: '900px'
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
</script>

<div class="border border-gray-300 rounded-lg bg-white">
	{#if option.course}
		<div class="text-center py-1 border-gray-300 border-b text-sm bg-blue-100 text-blue-500 font-bold">{option.course}</div>
	{/if}
	<div class="flex items-center justify-center mx-auto pt-4 pb-2 relative">
		<button on:click={onDeleteGrouper} class="absolute right-2 top-2 hover:text-red-500"><Icon className="w-3" name="close"/></button>
		<div on:click={() => {openDraftDialog(option)}} class="relative w-16 text-center overflow-hidden flex-shrink-0 p-1 rounded {!option.student_id ? 'border border-transparent hover:bg-blue-50 hover:shadow-lg hover:border-blue-300 cursor-pointer' : ''}">
			<img src="{option.student_id ? student_store.getStudentAvatar(option.student_id) : option.s_nickname ? '/pre-user-icon.png' : '/phone-icon.png'}" alt={option.s_nickname}
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
			<img src="{tutor_store.getTutorProfilePic(option.reserves[0].teacher_id)}" alt="{tutor_store.getTutorName(option.reserves[0].teacher_id)}"
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
				<button on:click={openCreateDialog} class="bg-blue-500 hover:bg-blue-700 text-white px-2 rounded absolute right-1 top-1 bottom-1">起堂</button>
			{/if}
		</div>
	</div>
	<div class="border-t border-gray-300 text-xs mt-2 bg-gray-50 rounded-b-lg px-2 flex items-center py-0.5">
		<p>{option.general_message || option.remark}</p>
		<div class="ml-auto"><button><Icon name="edit" className="w-2.5"/></button></div>
	</div>
</div>