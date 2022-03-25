<script>
	import TimePicker from '$lib/ui-elements/time-picker-2.svelte'
	import dayjs from "dayjs";
	import utc from "dayjs/plugin/utc.js";
	dayjs.extend(utc)
	import {onMount} from "svelte";
	import {http} from "$lib/http.js";
	import SelectionBox from '$lib/ui-elements/selection-box.svelte'
	import DatePicker from '$lib/ui-elements/date-picker/index.svelte'
	import Dropdown from '$lib/ui-elements/dropdown3.svelte'
	import Icon from '$lib/ui-elements/icon.svelte'
	import Checkbox from '$lib/ui-elements/checkbox.svelte'
	import Button from '$lib/ui-elements/button.svelte'
	import {triggerReload} from "$lib/helper/trigger-reload.js";
	import {getContext} from 'svelte'
	import {action_status} from "../../store/calendar-action-status-store.js";
	import {capitalize} from "$lib/helper/capitalize.js";
	import {tooltip} from "$lib/aciton/tooltip.js";
	import {notifications} from "$lib/store/notification.js";
	import {tutor_group_id} from "$lib/calendar/big-class-leson-menu.svelte";

	const {closeModal} = getContext('simple-modal')

	export let teacher_id
	export let start_date = undefined // create classroom to an empty course => pass start_date to anchor the first lesson
	export let tutor_course_id = undefined // add more classroom, pass tutor_course_id => get existing classroom setting
	let start_time = '08:00'
	let end_time = '08:30'
	let duration = 30
	let lesson_count = 4
	let computed_dates = []
	let classroom_list
	let material_list
	let selected_item_ids = []
	let existing_classroom
	let ticket = 98
	let student_size = 4
	let is_always_open = true
	let waiting_list
	let selected_users = []

	const ticket_options = [
		{
			value: 49,
			label: '$49 小學（大班）'
		},
		{
			value: 98,
			label: '$98 小學（4人班）'
		},
		{
			value: 68,
			label: '$68 中學（大班）'
		},
		{
			value: 136,
			label: '$136 中學 （4人班）'
		}
	]

	onMount(async () => {
		const res = await http.post(fetch, '/tutorCourseApi/list_tutor_course', {
			teacher_id
		})
		classroom_list = res.data
		if (tutor_course_id) {
			getTutorCourseDetail()
			getTutorCourseWaitingList()
		}
	})

	const getTutorCourseDetail = async () => {
		const {data} = await http.post(fetch, '/tutorCourseApi/list_tutor_course_by_id', {
			tutor_course_id
		})
		data.material_status.forEach(m => m.used_cnt = String(m.used_cnt))
		material_list = data.material_status
		existing_classroom = data.existing_classroom
		const last_classroom = existing_classroom[existing_classroom.length - 1]
		if (last_classroom) {
			duration = last_classroom.duration
			start_time = dayjs.utc(last_classroom.start_date).local().format('HH:mm')
			end_time = dayjs.utc(last_classroom.start_date).local().add(duration, 'minute').format('HH:mm')
			start_date = dayjs.utc(last_classroom.start_date).local().add(1, 'week').format('YYYY-MM-DD')
			ticket = last_classroom.ticket
			student_size = last_classroom.student_size
			is_always_open = last_classroom.is_always_open || true
		}
	}

	const getTutorCourseWaitingList = async () => {
		if (!tutor_group_id) return notifications.alert('ask backend: no tutor group id')
		const {data, success} = await http.get(fetch, '/adminApi/show_waiting_list', {
			tutor_course_id
		})
		if (success) waiting_list = data.length ? data[0].waiting_users : null
	}

	$: {
		if (duration || start_time || lesson_count) {
			computed_dates = []
			for (let i = 0; i < lesson_count; i++) {
				const _date = dayjs.utc(start_date).local().add(i, 'week').format('YYYY-MM-DD ') + start_time + ':00'
			  computed_dates[i] = dayjs(_date).utc().format('YYYY-MM-DD HH:mm:ss')
			}
		}
	}

	const onStartTimeInput = e => {
		start_time = e.detail
		end_time = dayjs(`1970-01-01 ${start_time}:00`).add(duration, 'minute').format('HH:mm')
	}

	const onEndTimeInput = e => {
		end_time = e.detail
		start_time = dayjs(`1970-01-01 ${end_time}:00`).subtract(duration, 'minute').format('HH:mm')
	}

	const onDurationInput = e => {
		end_time = dayjs(`1970-01-01 ${start_time}:00`).add(e.target.value, 'minute').format('HH:mm')
	}

	const onClassroomSelected = e => {
		tutor_course_id = e.detail
		getTutorCourseDetail()
		getTutorCourseWaitingList()
	}

	const onCreate = async () => {
		const course_data = computed_dates.map((date,i) => {
			return {
				item_id: selected_item_ids[i],
				teacher_id,
				start_date: date,
				duration,
				tutor_course_id,
				ticket,
				student_size,
				is_always_open,
				student_ids: selected_users[i] ? selected_users[i].map(s => s.student_id) : []
			}
		})
		const {data} = await http.post(fetch, '/courseApi/batch_reg_course', {
			course_data
		}, {
			notification: '起左'
		})
		triggerReload()
		closeModal()
		action_status.set('')
	}
	
	const onToggleStudent = (i, student) => {
		if (!Array.isArray(selected_users[i])) {
			selected_users[i] = []
		}
		if (selected_users[i].includes(student)) {
			selected_users[i].splice(selected_users[i].indexOf(student), 1)
		} else {
			selected_users[i].push(student)
		}
		selected_users = selected_users
	}
</script>

<h2 class="font-light text-xl mb-2">Batch建立課堂</h2>

{#if classroom_list}
	<label class="text-gray-500 text-sm mb-1 mt-2 block">Classroom</label>
	<SelectionBox options={classroom_list} on:input={onClassroomSelected}
	              selected_value={tutor_course_id}
	              value_key="tutor_course_id" label_key="title"/>
{/if}

{#if tutor_course_id}
	<div class="flex my-2">
		<div class="mr-1">
			<p class="text-label">長度(min)</p>
			<input bind:value={duration} on:input={onDurationInput} type="number" class="text-sm w-20 px-2 py-1 border border-gray-300 bg-gray-100">
		</div>
		<div>
			<p class="text-label">開始時間</p>
			<TimePicker hh_mm={start_time} on:input={onStartTimeInput}/>
		</div>
		<div class="ml-1">
			<p class="text-label">完結時間</p>
			<TimePicker hh_mm={end_time} on:input={onEndTimeInput}/>
		</div>
		<div class="ml-4">
			<p class="text-label">Ticket</p>
			<SelectionBox options={ticket_options}
			              placeholder="Ticket price"
			              selected_value={ticket}
			              on:input={e => {ticket = e.detail}}/>
		</div>
		<div class="ml-1">
			<p class="text-label">人數</p>
			<input bind:value={student_size} type="number" class="text-sm w-20 px-2 py-1 border border-gray-300 bg-gray-100">
		</div>
		<div class="ml-2">
			<p class="text-label">即出？</p>
			<input bind:checked={is_always_open} type="checkbox" class="text-sm border border-gray-300 bg-gray-100">
		</div>
	</div>

	<div class="my-4 overflow-y-scroll" style="max-height: calc(100vh - 340px)">
		<p class="text-label">已建立的班房</p>
		{#if existing_classroom}
			{#each existing_classroom as classroom}
				<div class="my-2 flex items-start">
					<p class="text-sm w-48 flex-shrink-0">{dayjs.utc(classroom.start_date).local().format('DD MMM YYYY (ddd) h:mma')}</p>
					<p class="ml-4 text-sm">{classroom.title}</p>
					{#if classroom.is_always_open === '0'}
						<p class="ml-2 text-sm text-red-500">水温堂</p>
					{/if}
				</div>
			{/each}
		{/if}
		<div class="flex items-center">
			<p class="text-label">將新增的班房 (數量：</p>
			<input class="text-sm w-12 px-2 py-1 border border-gray-300 bg-gray-100 ml-0.5 mr-1" type="number" bind:value={lesson_count}>
			<div class="text-label">)</div>
		</div>
		<div class="flex items-center mt-2">
			<p class="text-label">於這日開始：</p>
			<div class="ml-4">
				<DatePicker on:datechange={(e) => {start_date = dayjs(e.detail).format('YYYY-MM-DD')}} selected={dayjs(start_date, 'YYYY-MM-DD HH:mm:ss').toDate()}/>
			</div>
		</div>
		{#each computed_dates as date,i}
			<div class="flex items-center my-1">
				<p class="text-sm w-48 flex-shrink-0">{dayjs.utc(date).local().format('DD MMM YYYY (ddd) h:mma')}</p>
				{#if material_list}
					<div class="ml-4 w-full" style="max-width: 480px">
						<SelectionBox options={material_list} on:input={e => {selected_item_ids[i] = e.detail}}
						              selected_value={selected_item_ids[i]}
						              value_key="item_id" label_key="name" subtitle_prefix="Used count:" subtitle_key="used_cnt" image_key="thumbnail_path"/>
					</div>
					<div class="w-16 ml-2 flex-shrink-0">
						{#if selected_item_ids[i]}
							<button on:click={() => {open(`/item/${selected_item_ids[i]}`,'Preview', "popup")}} class="button-secondary">Preview</button>
						{/if}
					</div>
					<div class="w-8 ml-1 flex-shrink-0">
						{#if waiting_list}
							<Dropdown open_on_hover={false} activator_style="w-8 h-8 rounded-full cc bg-blue-50 text-blue-500" placement="bottom-end">
								<button slot="activator">
									<Icon name="avatar-add" className="w-5"/>
								</button>
								<div class="dropdown">
									{#each waiting_list as student}
										<div on:click|stopPropagation={() => {onToggleStudent(i,student)}} class="flex items-center my-0 cursor-pointer hover:bg-gray-100 px-2 py-2 rounded">
											<div class="w-8 h-8 rounded-full border-1 border-gray-300 relative shadow flex-shrink-0">
												<img src="/student-{student.gender}-icon.png" alt="gender" class="rounded-full border border-blue-500">
												<div class="absolute shadow font-bold border border-white -bottom-1 -right-2 ml-2 w-5 h-5 bg-blue-500 rounded-full text-xs cc text-white">{capitalize(student.level)}</div>
											</div>
											<div class="ml-6">
												<div class="flex items-center">
													<p class="leading-none mb-0.5">{student.nickname}</p>
												</div>
												<p class="text-xs leading-none text-gray-500">{student.t_amt} ticket</p>
											</div>
											<div class="ml-4">
												<Checkbox checked={selected_users[i] && selected_users[i].includes(student)}/>
											</div>
										</div>
									{/each}
								</div>
							</Dropdown>
						{:else}
							<div use:tooltip={'waiting list is empty'}><Icon name="avatar-add" className="w-5 text-gray-300"/></div>
						{/if}
					</div>
				{/if}
			</div>
			<div>
				{#if selected_users[i] && selected_users[i].length}
				{#each selected_users[i] as student}
					<div class="inline-flex items-center mr-2 bg-gray-50 border border-blue-300 hover:border-blue-500 hover:bg-white rounded-full mt-2 relative">
						<div class="w-8 h-8 rounded-full border-1 border-gray-300 relative shadow flex-shrink-0">
							<img src="/student-{student.gender}-icon.png" alt="gender" class="rounded-full border border-blue-500">
							<div class="absolute shadow font-bold border border-white -bottom-2 -right-4 ml-2 w-7 h-7 bg-blue-500 rounded-full text-sm cc text-white">{capitalize(student.level)}</div>
						</div>
						<div class="pl-5 pr-2 py-1">
							<div class="text-sm whitespace-nowrap">{student.nickname}</div>
							<div class="text-xs leading-none text-gray-500">@{student.username}</div>
						</div>
						<div class="pl-2 mr-4 py-1 border-l border-gray-400 text-xs leading-none text-gray-500" style="font-size: 10px;">
							{#if student.total_t_amt <= 6 * 49}
								<div class="bg-yellow-500 rounded text-white inline-block px-1 leading-tight mb-0.5">新用戶</div>
							{:else if student.t_amt < 6 *49}
								<div class="bg-red-500 rounded text-white inline-block px-1 leading-tight mb-0.5">要跟進大戶</div>
							{:else}
								<div class="bg-blue-500 rounded text-white inline-block px-1 leading-tight mb-0.5">大戶</div>
							{/if}
							<p>總共 ${student.total_t_amt}</p>
							<p class="text-black mt-0.5">結餘 ${student.t_amt}</p>
						</div>
						<button on:click={() => {onToggleStudent(i, student)}} class="absolute -top-1.5 -right-2 bg-white cc rounded-full w-5 h-5 border border-blue-500 hover:text-red-500 hover:bg-red-50">
							<Icon name="close" className="w-2"/>
						</button>
					</div>
				{/each}
				{/if}
			</div>
		{/each}
	</div>

	<div class="flex mt-6 justify-end">
		<Button on:click={onCreate}>Create</Button>
	</div>
{/if}