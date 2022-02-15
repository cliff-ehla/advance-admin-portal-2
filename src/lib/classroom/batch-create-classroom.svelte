<script>
	import TimePicker from '$lib/ui-elements/time-picker-2.svelte'
	import dayjs from "dayjs";
	import {onMount} from "svelte";
	import {http} from "$lib/http.js";
	import SelectionBox from '$lib/ui-elements/selection-box.svelte'
	import Button from '$lib/ui-elements/button.svelte'

	export let start_date
	export let teacher_id
	let tutor_course_id
	let start_time = '08:00'
	let end_time = '08:30'
	let duration = 30
	let lesson_count = 4
	let computed_dates = []
	let classroom_list
	let material_list
	let selected_item_ids = []
	let existing_classroom

	onMount(async () => {
		const res = await http.post(fetch, '/tutorCourseApi/list_tutor_course', {
			teacher_id
		})
		classroom_list = res.data
	})

	const getMaterialList = async () => {
		const {data} = await http.post(fetch, '/tutorCourseApi/list_tutor_course_by_id', {
			tutor_course_id
		})
		data.material_status.forEach(m => m.used_cnt = String(m.used_cnt))
		material_list = data.material_status
		existing_classroom = data.existing_classroom
		const first_classroom = existing_classroom[0]
		if (first_classroom) {
			duration = first_classroom.duration
			start_time = dayjs(first_classroom.start_date).format('HH:mm')
			end_time = dayjs(first_classroom.start_date).add(duration, 'minute').format('HH:mm')
		}
	}

	$: {
		if (duration || start_time || lesson_count) {
			computed_dates = []
			for (let i = 0; i < lesson_count; i++){
			  computed_dates[i] = dayjs(start_date).add(i, 'week').format('YYYY-MM-DD ') + start_time + ':00'
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
		getMaterialList()
	}

	const onCreate = async () => {
		const payload = computed_dates.map((date,i) => {
			return {
				item_id: selected_item_ids[i],
				teacher_id,
				start_date: date,
				duration,
				tutor_course_id,
				ticket: 999, // TODO
				student_size: 4 // TODO
			}
		})
		const {data} = await http.post(fetch, '/courseApi/batch_reg_course', payload, {
			notification: '起左'
		})
	}
</script>

<h2 class="font-light text-xl mb-2">Batch建立課堂</h2>

{#if classroom_list}
	<label class="text-gray-500 text-sm mb-1 mt-2 block">Classroom</label>
	<SelectionBox options={classroom_list} on:input={onClassroomSelected}
	              selected_value={tutor_course_id}
	              value_key="tutor_course_id" label_key="title"/>
{/if}

<div class="my-2">
	<p class="text-label">課堂數量</p>
	<input class="text-sm w-20 px-2 py-1 border border-gray-300 bg-gray-100" type="number" bind:value={lesson_count}>
</div>
<div class="my-2">
	<p class="text-label">長度(min)</p>
	<input bind:value={duration} on:input={onDurationInput} type="number" class="text-sm w-20 px-2 py-1 border border-gray-300 bg-gray-100">
</div>
<div class="flex my-2">
	<div>
		<p class="text-label">開始時間</p>
		<TimePicker hh_mm={start_time} on:input={onStartTimeInput}/>
	</div>
	<div class="ml-1">
		<p class="text-label">完結時間</p>
		<TimePicker hh_mm={end_time} on:input={onEndTimeInput}/>
	</div>
</div>

<div class="my-4">
	<p class="text-label">已建立的班房</p>
	{#if existing_classroom}
		{#each existing_classroom as classroom}
			<div class="my-2 flex items-center">
				<p class="text-sm w-64">{dayjs(classroom.start_date).format('DD MMM YYYY (dddd) h:mma')}</p>
				<p>{classroom.title}</p>
			</div>
		{/each}
	{/if}
	<p class="text-label">將新增的班房</p>
	{#each computed_dates as date,i}
		<div class="flex items-center my-1">
			<p class="text-sm w-64">{dayjs(date).format('DD MMM YYYY (dddd) h:mma')}</p>
			{#if material_list}
				<div class="ml-4">
					<SelectionBox options={material_list} on:input={e => {selected_item_ids[i] = e.detail}}
					              selected_value={selected_item_ids[i]}
					              value_key="item_id" label_key="name" subtitle_prefix="Used count:" subtitle_key="used_cnt" image_key="thumbnail_path"/>
				</div>
			{/if}
		</div>
	{/each}
</div>

<div class="flex mt-6 justify-end">
	<Button on:click={onCreate}>Create</Button>
</div>