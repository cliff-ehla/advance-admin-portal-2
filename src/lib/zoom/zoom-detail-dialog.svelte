<script>
	import {onMount, getContext} from 'svelte'
	import {setZoomActualDuration, setZoomStudentNoShow, setZoomTrailSuccessBuyTime, setZoomTutorNoShow, setZoomCancel, setZoomIsTrail, deleteZoom, setZoomRemark, setZoomSalary} from "../../api/zoom-api";
	import DatePicker from '../ui-elements/date-picker/index.svelte'
	import Dropdown from '../ui-elements/dropdown3.svelte'
	import Icon from '../ui-elements/icon.svelte'
	import dayjs from "dayjs";
	const {closeModal} = getContext('simple-modal')
	import {debounce} from 'debounce'

	export let zoom
	let wrapper_id = zoom.zoom_id
	export let onConfirm = () => {}
	export let onDelete = () => {}
	import {http} from "../../helpers/http";

	let clone = {...zoom}
	if (!clone.trial_success_buy_time) {
		clone.trial_success_buy_time = new Date()
	} else {
		clone.trial_success_buy_time = dayjs(clone.trial_success_buy_time).toDate()
	}

	let enable_trail_success = !!zoom.trial_success_buy_time

	const onConfirmClick = () => {
		if (!enable_trail_success) clone.trial_success_buy_time = ''
		onConfirm(clone)
		console.log(clone)
		closeModal()
	}

	const onStudentNoShowToggle = (e) => {
		setZoomStudentNoShow({
			wrapper_id,
			s_no_show: e.target.checked
		})
	}

	const onTutorNoShowToggle = (e) => {
		setZoomTutorNoShow({
			wrapper_id,
			t_no_show: e.target.checked
		})
	}

	const onIsCancelToggle = (e) => {
		setZoomCancel({
			wrapper_id,
			is_cancel: e.target.checked
		})
	}

	const onStudentSickLeaveToggle = (e) => {
		http.post('zoomApi/set_student_sick_leave', {
			wrapper_id,
			s_sick_leave: e.target.checked
		})
	}

	const onTeacherSickLeaveToggle = (e) => {
		http.post('zoomApi/set_student_sick_leave', {
			wrapper_id,
			s_sick_leave: e.target.checked
		})
	}

	const onIsTrialToggle = (e) => {
		setZoomIsTrail({
			wrapper_id,
			is_trial: e.target.checked
		})
	}

	const onCancelTrailSuccessDate = () => {
		setZoomTrailSuccessBuyTime({
			wrapper_id,
			trial_success_buy_time: ''
		})
	}

	const onConfirmActualDuration = debounce(() => {
		setZoomActualDuration({
			wrapper_id,
			actual_duration: clone.actual_duration
		})
	}, 500)

	const onRemarkChange = debounce(() => {
		setZoomRemark({
			wrapper_id,
			admin_remark: clone.admin_remark
		})
	}, 500)

	const onOverrideSalaryChange = debounce(() => {
		setZoomSalary({
			wrapper_id,
			override_salary: clone.override_salary
		})
	}, 500)

	const onDeleteClick = () => {
		if (confirm("Do you want to delete?") == true) {
			deleteZoom({wrapper_id})
			onDelete(wrapper_id)
			closeModal()
		}
	}

	const onSuccessDateToggle = (e) => {
		if (!e.target.checked) {
			clone.trial_success_buy_time = ''
			enable_trail_success = false
			setZoomTrailSuccessBuyTime({
				wrapper_id,
				trial_success_buy_time: ''
			})
		} else {
			enable_trail_success = true
			clone.trial_success_buy_time = new Date()
			setTimeout(() => {
				setZoomTrailSuccessBuyTime({
					wrapper_id,
					trial_success_buy_time: dayjs(clone.trial_success_buy_time).format('YYYY-MM-DD HH:mm:ss')
				})
			}, 50)
		}
	}

	const onBuyTimeSelected = e => {
		clone.trial_success_buy_time = e.detail
		let date_string = dayjs(e.detail).format('YYYY-MM-DD HH:mm:ss')
		setZoomTrailSuccessBuyTime({
			wrapper_id,
			trial_success_buy_time: date_string
		})
	}
</script>

<div class="text-sm relative">
	<div class="absolute top-0 -right-4">
		<Dropdown placement="bottom-end">
			<button slot="activator" class="w-10 h-10 flex items-center justify-center">
				<Icon className="w-6" name="more"/>
			</button>
			<div class="shadow-lg bg-white border border-gray-300 w-64">
				<div on:click={onDeleteClick} class="px-4 py-2 hover:text-gray-100 hover:text-red-500 cursor-pointer">Delete</div>
			</div>
		</Dropdown>
	</div>
	<div class="flex items-center mb-2 h-10">
		<p class="w-48">Is Trial</p>
		<input on:input={onIsTrialToggle} type="checkbox" bind:checked={clone.is_trial}>
	</div>
	<div class="flex items-center h-10">
		<p class="w-48">Trial success</p>
		<input type="checkbox" on:input={onSuccessDateToggle} bind:checked={enable_trail_success} class="mr-2">
		{#if enable_trail_success && clone.trial_success_buy_time}
			<DatePicker on:datechange={onBuyTimeSelected} selected={clone.trial_success_buy_time}/>
		{/if}
	</div>
	<div class="flex items-center mb-2 h-10">
		<p class="w-48">Is Cancel</p>
		<input on:input={onIsCancelToggle} type="checkbox" bind:checked={clone.is_cancel}>
	</div>

	<div class="flex items-center mb-2 h-10">
		<p class="w-48">Student sick leave</p>
		<input on:input={onStudentSickLeaveToggle} type="checkbox" bind:checked={clone.s_sick_leave}>
	</div>
	<div class="flex items-center mb-2 h-10">
		<p class="w-48">Teacher sick leave</p>
		<input on:input={onTeacherSickLeaveToggle} type="checkbox" bind:checked={clone.t_sick_leave}>
	</div>

	<div class="flex items-center mb-2 h-10">
		<p class="w-48">Student no show</p>
		<input on:input={onStudentNoShowToggle} type="checkbox" bind:checked={clone.s_no_show}>
	</div>
	<div class="flex items-center mb-2 h-10">
		<p class="w-48">Teacher no show</p>
		<input on:input={onTutorNoShowToggle} type="checkbox" bind:checked={clone.t_no_show}>
	</div>
	<div class="flex items-center mb-2 h-10">
		<p class="w-48">Actual duration (min)</p>
		<input on:input={onConfirmActualDuration} bind:value={clone.actual_duration} class="w-20 border border-gray-300 px-2 py-1" type="number">
	</div>
	<div class="flex items-center h-10">
		<div class="w-48 flex-shrink-0">
			<p>Override salary</p>
		</div>
		<input type="number" on:input={onOverrideSalaryChange} bind:value={clone.override_salary} class="w-20 border border-gray-300 px-2 py-1"/>
	</div>

	<div class="my-4 bg-gray-200 h-0.5"></div>
	<div class="mb-2">
		<p>Remarks</p>
	</div>
	<textarea on:input={onRemarkChange} bind:value={clone.admin_remark} rows="4" class="w-96 border border-gray-300 px-2 py-1"></textarea>

	<div class="flex mt-6">
		<button class="mr-4 w-full border border-gray-200 hover:border-gray-300 py-2 rounded" on:click={closeModal}>Cancel</button>
		<button class="bg-blue-500 text-white w-full py-2 rounded hover:bg-blue-700" on:click={onConfirmClick}>Confirm</button>
	</div>
</div>