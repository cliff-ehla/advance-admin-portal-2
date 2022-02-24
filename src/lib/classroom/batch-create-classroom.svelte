<script>
	import TimePicker from '$lib/ui-elements/time-picker-2.svelte'
	import dayjs from "dayjs";
	import utc from "dayjs/plugin/utc.js";
	dayjs.extend(utc)
	import {onMount} from "svelte";
	import {http} from "$lib/http.js";
	import SelectionBox from '$lib/ui-elements/selection-box.svelte'
	import DatePicker from '$lib/ui-elements/date-picker/index.svelte'
	import Button from '$lib/ui-elements/button.svelte'
	import {triggerReload} from "$lib/helper/trigger-reload.js";
	import {getContext} from 'svelte'
	import {action_status} from "../../store/calendar-action-status-store.js";

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
		if (tutor_course_id) getTutorCourseDetail()
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
	}

	const onCreate = async () => {
		console.log('is_always_open', is_always_open)
		const course_data = computed_dates.map((date,i) => {
			return {
				item_id: selected_item_ids[i],
				teacher_id,
				start_date: date,
				duration,
				tutor_course_id,
				ticket,
				student_size,
				is_always_open
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
				{/if}
			</div>
		{/each}
	</div>

	<div class="flex mt-6 justify-end">
		<Button on:click={onCreate}>Create</Button>
	</div>
{/if}