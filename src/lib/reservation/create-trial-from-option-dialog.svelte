<script>
	export let slot = {}
	export let reserve = {}
	export let onSuccess = () => {}

	let phone = reserve.phone
	let grouper_id = reserve.grouper_id
	let reserved_id = slot.reserved_id

	import dayjs from "dayjs";
	import utc from 'dayjs/plugin/utc.js'
	import {tutor_store} from "../../store/tutor-store";
	import {student_store} from "../../store/student-store";
	import {getContext} from 'svelte'
	const {closeModal} = getContext('simple-modal')
	import {confirmZoomTrial} from "../../api/zoom-api";
	import CreateNewUser from '../student/create-new-user.svelte'
	import MaterialSelectionList from '../../lib/material/material-selection-list.svelte'

	dayjs.extend(utc)

	let loading

	export let student_id
	let nickname = reserve.s_nickname
	let level = reserve.lv
	let age = reserve.age
	let general_message = reserve.general_message
	let gender = reserve.gender
	let selected_item_id
	let is_show_message
	let message
	let copy_text_el
	let lesson_fee
	let app_fee

	const genMessage = () => {
		let line_1 = dayjs(slot.end_date).diff(dayjs(slot.start_date), 'minute') + ' min Trial Lesson'
		let line_2 = 'HKT: ' + dayjs.utc(slot.start_date).local().format('DD MMM (ddd)@h:mma') + '-' + dayjs.utc(slot.end_date).local().format('h:mma')
		let line_3 = 'Teacher:' + tutor_store.getTutorName(slot.teacher_id)
		let line_4 = `Student: ${nickname} (${gender.toUpperCase()})`
		let line_5 = `Level: ${level.charAt(0).toUpperCase() + level.substring(1)}`
		let line_6 = `Topic: ${reserve.material}`
		return line_1 + '\n' + line_2 + '\n' + line_3 + '\n' + line_4 + '\n' + line_5+ '\n' + line_6
	}

	const onCreated = async ({detail}) => {
		nickname = detail.nickname
		age = detail.age
		gender = detail.gender
		level = detail.level
		student_id = detail.user_id
	}

	const confirmZoom = async () => {
		loading = true
		message = genMessage()
		await confirmZoomTrial({
			reserved_id,
			student_id,
			item_id: selected_item_id,
			grouper_id,
			lesson_fee,
			app_fee,
			voucher_date: dayjs().format('YYYY-MM-DD')
		})
		is_show_message = true
		loading = false
	}

	const copyAndConfirm = () => {
		copy_text_el.select()
		document.execCommand("copy");
		onSuccess()
		closeModal()
	}
</script>

<div class="relative w-full">
	<div class="p-4">
		<div class="flex-1">
			<div class="mb-4">
				<p class="text-lg font-bold">Confirm trial options</p>
				<p>for
					{#if phone}
						<span class="text-blue-500 border-b border-current">{phone}</span>
					{:else}
						<span class="text-blue-500 border-b border-current">{student_store.getStudentName(student_id)}</span>
					{/if}
				</p>
			</div>
			<div class="bg-gray-100 border-blue-500 border-l-4 pr-2 py-2 pl-4">
				<p class="font-bold">{tutor_store.getTutorName(slot.teacher_id) || 'noname'}</p>
				<p>{dayjs.utc(slot.start_date).local().format('MMM DD (ddd)@ h:mma')} - {dayjs.utc(slot.end_date).local().format('h:mma')}</p>
			</div>
			<div>

				{#if !student_id}
					<CreateNewUser remark={general_message} {gender} {level} {nickname} parent_mobile={phone} on:created={onCreated}/>
				{:else}
					<div class="my-4">
						<div class="text-gray-500 text-sm mt-2">Lesson fee</div>
						<input type="text" bind:value={lesson_fee} placeholder="Lesson fee" class="border border-gray-300 rounded px-4 py-1">
						<div class="text-gray-500 text-sm mt-2">App fee</div>
						<input type="text" bind:value={app_fee} placeholder="App fee" class="border border-gray-300 rounded px-4 py-1">
					</div>
					<div class="my-4">
						<p class="font-bold my-2 text-red-500">Student id: {student_id}</p>
						{#if reserve.material}
							<p class="font-bold my-2">Material: {reserve.material}, Age: {reserve.age}</p>
						{/if}
					</div>

					<MaterialSelectionList on:input={e => selected_item_id = e.detail.item_id}/>
					<button class="rounded-full px-4 py-3 w-full bg-blue-500 text-white text-center" on:click={confirmZoom}>Confirm zoom lesson</button>
				{/if}
			</div>
		</div>
	</div>

	{#if is_show_message}
		<div class="absolute inset-0 bg-white bg-opacity-50 flex items-center justify-center">
			<div class="w-96 shadow-lg border border-gray-300 bg-white p-4 rounded">
				<p class="mb-4 font-bold">Confirm message</p>
				<textarea bind:value={message} bind:this={copy_text_el} cols="30" rows="10"></textarea>
				<div class="mt-4">
					<button class="bg-green-500 text-white rounded-full px-8 py-2 hover:bg-green-700" on:click={copyAndConfirm}>Copy and confirm</button>
				</div>
			</div>
		</div>
	{/if}
</div>