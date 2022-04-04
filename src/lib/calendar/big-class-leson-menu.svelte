<script>
	import {http} from "$lib/http.js";
	import {student_store} from "../../store/student-store.js";

	export let zoom_id
	export let item_id
	export let tutor_group_id
	export let tutor_course_id
	export let tutor_id
	export let level
	export let description_code_short_id
	export let selected = false
	export let onToggle = () => {}
	import {onMount} from 'svelte'
	import {tooltip} from "$lib/aciton/tooltip.js";
	import Icon from '$lib/ui-elements/icon.svelte'
	import Spinner from '$lib/ui-elements/spinner.svelte'
	import Dropdown from '$lib/ui-elements/dropdown3.svelte'
	import StudentWithTickerSelectionBox from '$lib/student/user-with-ticket-selection-box.svelte'
	import {getContext} from 'svelte'
	import {dialog} from "$lib/store/dialog.js";
	import dayjs from "dayjs";
	import utc from "dayjs/plugin/utc.js";
	import {big_class_events} from "$lib/store/big-class-store.js";
	import {sentry} from "$lib/sentry.js";
	import {tutor_store} from "../../store/tutor-store.js";
	import {capitalize} from '$lib/helper/capitalize.js'
	import {notifications} from "$lib/store/notification.js";

	dayjs.extend(utc)
	const {openModal, closeModal} = getContext('simple-modal')

	let students
	let waiting_list
	let max_students
	let res
	let edit_mode = false
	let multi_selected_student_ids = []
	$: is_full = res ? max_students === students.length : false
	$: is_multiple_mode = multi_selected_student_ids.length > 0

	onMount(() => {
		fetchData()
		fetchWaitingList()
	})

	const fetchWaitingList = async () => {
		if (!tutor_group_id) return notifications.alert('ask backend: no tutor group id')
		const {success, data} = await http.get(fetch, '/adminApi/show_waiting_list', {
			tutor_course_id
		})
		if (success) {
			waiting_list = data[0] ? data[0].waiting_users : []
		}
	}

	const fetchData = async () => {
		const {data} = await http.post(fetch, '/zoomApi/zoom_detail', {
			wrapper_id: zoom_id
		})
		students = data.students
		res = data
		max_students = data.big_classroom_type === 'SMALL' ? 4 : data.big_classroom_type === 'BIG' ? 20 : 9999
		students = students.map(s => {
			return {
				date: dayjs.utc(s.reg_date).local().format('DD MMM YYYY'),
				duration: dayjs().diff(dayjs.utc(s.reg_date).local(), 'day'),
				student: student_store.getStudent(s.user_id),
				user_id: s.user_id
			}
		})
		students = students.filter(s => {
			if (!s.student) {
				sentry.log(`big-class-lesson-menu： map 唔到呢個學生ID: ${s.user_id}`)
			}
			return s.student
		})
	}

	const onReg = async (student_id, is_reg) => {
		let message = is_reg ? '係咪Reg?' : '係咪UnReg?'
		let notification = is_reg ? '成功幫佢Reg堂' : '成功幫佢UnReg堂'
		const url = is_reg ? '/courseApi/reg_registrable_classroom' : '/courseApi/unreg_registrable_classroom'
		dialog.confirm({
			message,
			onConfirm: async () => {
				if (is_reg) {
					const {success, data} = await http.post(fetch, '/courseApi/check_bought_status', {
						item_ids: [item_id],
						student_id
					})
					if (success && data.purchased.length > 0) {
						return notifications.alert(`${student_id} 已經玩過呢個material ${item_id}`)
					}
				}
				await http.post(fetch, url, {
					tutor_group_id,
					child_id: student_id
				}, {
					notification
				})
			},
			onSuccess: async () => {
				document.dispatchEvent(new CustomEvent('refresh-calendar', {
					bubbles: true,
					cancelable: true
				}))
				await student_store.fetchData(fetch)
				await fetchData()
			}
		})
	}

	const onBatchReg = () => {
		dialog.confirm({
			message: 'Batch register',
			onConfirm: async () => {
				const promises = multi_selected_student_ids.map(async id => {
					const {success, data} = await http.post(fetch, '/courseApi/check_bought_status', {
						item_ids: [item_id],
						student_id: id
					})
					if (id == 30120 || success && data.purchased.length > 0) {
						let msg = `${id} 已經玩過呢個material ${item_id}`
						notifications.alert(msg)
						return Promise.resolve(msg)
					}
					return http.post(fetch, '/courseApi/reg_registrable_classroom', {
						tutor_group_id,
						child_id: id
					}, {
						notification: `Added student id: ${id}`
					})
				})
				const results = await Promise.all(promises)
				return true
			},
			onSuccess: async () => {
				multi_selected_student_ids = []
				document.dispatchEvent(new CustomEvent('refresh-calendar', {
					bubbles: true,
					cancelable: true
				}))
				await student_store.fetchData(fetch)
				await fetchData()
			}
		})
	}

	const toggleSelection = () => {
		if (!selected) {
			big_class_events.addSelection(zoom_id)
		} else {
			big_class_events.removeSelection(zoom_id)
		}
		onToggle()
		closeModal()
	}

	const onRegWaitingList = (student_id) => {
		dialog.confirm({
			message: 'Add this student to waiting list',
			text_input: {
				placeholder: 'Remark',
				value: ''
			},
			onConfirm: ({text_input}) => {
				return http.post(fetch, '/adminApi/mark_user_in_waiting_list', {
					student_id,
					tutor_course_id,
					remark: text_input
				}, {
					notification: 'Added to waiting list'
				})
			},
			onSuccess: fetchWaitingList
		})
	}
	
	const onRemoveFromWaitingList = (student) => {
		dialog.confirm({
			message: 'Remove this student from waiting list?',
			onConfirm: () => {
				return http.post(fetch, '/adminApi/remove_user_from_waiting_list', {
					student_id: student.student_id,
					tutor_course_id
				}, {
					notification: "Removed from waiting list"
				})
			},
			onSuccess: fetchWaitingList
		})
	}

	const isSelected = (student_id) => {
		return students.map(s => s.user_id).includes(student_id)
	}
</script>

<div>
	<div class="flex items-center px-4 pb-2 pt-3 border-b border-gray-300">
		<img class="w-12 h-12 rounded-full" src={tutor_store.getTutorProfilePic(tutor_id)} alt="name">
		<div class="ml-4">
			<div class="flex items-center">
				<p class="text-xl">{tutor_store.getTutorName(tutor_id)}</p>
				<p class="bg-purple-500 text-white px-2 text-sm py-0.5 rounded ml-2">{description_code_short_id}</p>
				<p class="border-purple-500 text-purple-500 px-2 text-sm py-0.5 border bg-purple-50 rounded ml-2">{level}</p>
			</div>
			{#if res}
				<div class="flex mt-0.5">
					<p class="text-sm text-gray-500">{res.sub_cat_hk}</p>
					<p class="text-sm text-gray-500 ml-2">{dayjs.utc(res.start_date).local().format('DD MMM@HH:mm')}</p>
				</div>
			{/if}
		</div>
		<div class="ml-auto flex items-center">
			<div>
				<p class="text-xs mb-0.5">推介</p>
				<input type="checkbox" on:input={toggleSelection} checked={selected} class="w-6 h-6">
			</div>
			<div class="ml-4">
				<button on:click={closeModal} class="w-8 h-8 rounded-full bg-blue-50 cc hover:bg-blue-100 group">
					<Icon name="close" className="w-3 text-gray-500 group-hover:text-blue-500"/>
				</button>
			</div>
		</div>
	</div>
<!--	<p class="text-xs text-gray-500 mb-2">Zoom ID: {zoom_id}</p>-->
<!--	<p class="text-xs text-gray-500 mb-2">Tutor group ID: {tutor_group_id}</p>-->
	<div class="flex">
		<div class="flex-1 flex flex-col">
			{#if students}
				<div class="flex items-center border-gray-300 border-b px-4 py-3">
					<div>Registered students： <span class="bg-blue-50 rounded px-1 text-sm py-0.5 text-blue-500">{students.length}/{max_students}</span></div>
					{#if is_full}
						<span class="ml-2 px-2 py-0.5 text-xs bg-red-500 text-white rounded">Full</span>
					{/if}
				</div>
				<div class="p-4 overflow-auto mb-4" style="max-height: calc(100vh - 200px); min-height: 200px">
					{#if students.length}
						{#each students as student}
							<div use:tooltip={student.student.student_username} class="inline-flex items-center mr-2 bg-gray-50 border border-blue-300 hover:border-blue-500 hover:bg-white rounded-full mt-2 relative">
								<div class="w-8 h-8 rounded-full border-1 border-gray-300 relative shadow flex-shrink-0">
									<img src="/student-{student.student.gender}-icon.png" alt="gender" class="rounded-full border border-blue-500">
									<div class="absolute shadow font-bold border border-white -bottom-2 -right-4 ml-2 w-7 h-7 bg-blue-500 rounded-full text-sm cc text-white">{capitalize(student.student.level)}</div>
								</div>
								<div class="pl-5 pr-2 py-1">
									<div class="text-sm whitespace-nowrap">{student.student.student_nickname}</div>
									<div class="text-xs leading-none text-gray-500">{student.duration} days before</div>
								</div>
								<div class="pl-2 mr-4 py-1 border-l border-gray-400 text-xs leading-none text-gray-500" style="font-size: 10px;">
									{#if student.student.tt_t_amt <= 6 * 49}
										<div class="bg-yellow-500 rounded text-white inline-block px-1 leading-tight mb-0.5">新用戶</div>
									{:else if student.student.r_t_amt < 6 *49}
										<div class="bg-red-500 rounded text-white inline-block px-1 leading-tight mb-0.5">要跟進大戶</div>
									{:else}
										<div class="bg-blue-500 rounded text-white inline-block px-1 leading-tight mb-0.5">大戶</div>
									{/if}
									<p>總共 ${student.student.tt_t_amt}</p>
									<p class="text-black mt-0.5">結餘 ${student.student.r_t_amt}</p>
								</div>
								<button on:click|stopPropagation={() => {onReg(student.student.student_id, false)}} class="absolute -top-1.5 -right-2 bg-white cc rounded-full w-5 h-5 border border-blue-500 hover:text-red-500 hover:bg-red-50">
									<Icon name="close" className="w-2"/>
								</button>
							</div>
						{/each}
					{:else}
						冇人報
					{/if}
				</div>
				{#if !is_full}
					<div class="px-4 pb-4 mt-auto">
						<StudentWithTickerSelectionBox placement="top-start" placeholder="Register student to lesson" on:input={e => {onReg(e.detail.student_id, true)}}/>
					</div>
				{/if}
			{:else}
				<Spinner/>
			{/if}
		</div>
		<div class="w-72 border-l border-gray-300 flex flex-col">
			<div class="flex items-center border-gray-300 border-b px-4 py-3">
				<p>{edit_mode ? 'Editing waiting list' : 'Waiting list'}</p>
				<div class="ml-auto">
					{#if edit_mode}
						<button on:click={() => {edit_mode = !edit_mode}} use:tooltip={'Exit edit mode'} class="ml-auto bg-red-50 rounded-full w-6 h-6 cc">
							<Icon name="close" className="w-3 text-red-500"/>
						</button>
					{:else}
						<button on:click={() => {edit_mode = !edit_mode}} use:tooltip={'Edit waiting list'} class="ml-auto bg-blue-50 rounded-full w-6 h-6 cc">
							<Icon name="edit" className="w-3 text-blue-500"/>
						</button>
					{/if}
				</div>
			</div>
			{#if waiting_list && students}
				<div class="overflow-y-scroll mb-4" style="max-height: calc(100vh - 200px); min-height: 200px">
					{#if waiting_list.length}
						{#each waiting_list as student}
							<div class="py-2 px-4">
								<div class="flex items-center my-0">
									<div class="w-8 h-8 rounded-full border-1 border-gray-300 relative shadow flex-shrink-0">
										<img src="/student-{student.gender}-icon.png" alt="gender" class="rounded-full border border-blue-500">
										<div class="absolute shadow font-bold border border-white -bottom-2 -right-4 ml-2 w-7 h-7 bg-blue-500 rounded-full text-sm cc text-white">{capitalize(student.level)}</div>
									</div>
									<div class="ml-6">
										<div class="flex items-center">
											<p class="leading-none mb-0.5">{student.nickname}</p>
											{#if student.remark}
												<div class="ml-2" use:tooltip={student.remark}>
													<Icon className="w-4 text-blue-500" name="message"/>
												</div>
											{/if}
										</div>
										{#if student.t_amt === 0}
											<p class="text-xs leading-none text-red-500">No ticket</p>
										{:else}
											<p class="text-xs leading-none text-gray-500">{student.t_amt} ticket</p>
										{/if}
									</div>
									<div class="ml-auto flex">
										{#if edit_mode}
											<button on:click={() => {onRemoveFromWaitingList(student)}} class="w-8 h-8 transition-all rounded-full rounded-full cc hover:bg-red-100">
												<Icon name="trash" className="w-4 text-red-500"/>
											</button>
										{:else}
											{#if student.t_amt > 0}
												{#if (students || waiting_list) ? isSelected(student.student_id) : false}
													<button disabled class="cursor-not-allowed text-xs bg-gray-300 text-white rounded-full px-2 py-0.5">Registered</button>
												{:else}
													{#if !is_multiple_mode}
														<div class="div flex items-stretch bg-green-500 rounded">
															<button on:click={e => {onReg(student.student_id, true)}} class="text-xs bg-green-500 text-white hover:bg-green-400 rounded-l px-2 py-0.5">
																Register
															</button>
															<Dropdown placement="bottom-end" activator_style="py-1 bg-green-400 rounded-r text-white" activator_active_style="bg-green-300">
																<div slot="activator">
																	<Icon name="more" className="w-3"/>
																</div>
																<div class="dropdown">
																	<div on:click={() => {multi_selected_student_ids = [student.student_id]}} class="item">Select</div>
																</div>
															</Dropdown>
														</div>
													{:else}
														{#if (students || waiting_list) ? !isSelected(student.student_id) : false}
															<input type="checkbox" bind:group={multi_selected_student_ids} value={student.student_id} class="w-5 h-5">
														{/if}
													{/if}
												{/if}
											{:else if student.t_amt < 0}
												<div>
													<p class="text-xs text-red-500">唔應該係負數‌！</p>
													<button on:click={e => {onReg(student.student_id, true)}} class="text-xs bg-green-500 text-white hover:bg-green-400 rounded-full px-2 py-0.5">Register</button>
												</div>
											{/if}
										{/if}
									</div>
								</div>
							</div>
						{/each}
					{:else}
						<p class="text-gray-500 text-sm p-4">No students in waiting list</p>
					{/if}
				</div>
			{/if}
			{#if edit_mode}
				<div class="px-4 mt-auto pb-4">
					<StudentWithTickerSelectionBox placement="top-end" placeholder="Add student to waiting list" on:input={e => {onRegWaitingList(e.detail.student_id, true)}}/>
				</div>
			{/if}
			{#if is_multiple_mode}
				<div class="p-4">
					<button on:click={onBatchReg} class="w-full button">Batch register ({multi_selected_student_ids.length})</button>
				</div>
			{/if}
		</div>
	</div>
</div>


