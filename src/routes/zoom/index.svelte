<script>
	import {http} from "$lib/http.js";
	import dayjs from "dayjs";
	import utc from "dayjs/plugin/utc.js";
	import {getContext} from 'svelte'
	const {openModal, closeModal} = getContext('simple-modal')
	import BigClassLessonMenu from "$lib/calendar/big-class-leson-menu.svelte";
	dayjs.extend(utc)

	let zoom_id
	let result
	let map = {
		BIG: 20,
		SMALL: 4,
		UNLIMITED: 9999
	}
	import Button from '$lib/ui-elements/button.svelte'

	const onClick = async () => {
		let {data, success} = await http.post(fetch, '/zoomApi/zoom_detail', {
			wrapper_id: zoom_id
		})
		if (success) {
			result = data
		}
	}

	const onReg = () => {
		openModal(BigClassLessonMenu, {
			zoom_id: result.wrapper_id,
			tutor_group_id: result.tutor_group_id,
			tutor_course_id: result.tutor_course_id,
			description_code_short_id: result.code_id,
			level: result.rc_level,
			tutor_id: result.teacher_id
		}, {
			overflow: 'initial',
			width: '900px',
			padding: '0',
			closeButton: false
		})
	}
</script>

<div class="p-4">
	<p>Search by zoom ID</p>
	<input placeholder="Search classroom by zoom ID" class="input" bind:value={zoom_id} type="text">
	<Button on:click={onClick}>Search</Button>

	{#if result}
		{#if result.is_big_classroom === "1"}
			<div class="p-4">
				<p class="text-blue-500">{dayjs.utc(result.start_date).local().format('DD MMM YYYY h:mma')}</p>

				<div class="my-4">
					<p>{result.sub_cat_hk}</p>
					<p class="text-sm">{result.title}</p>
				</div>

				<p>能力程度: {result.rc_type}</p>

				<p>課時: {result.duration} 分鐘</p>

				<p>老師: {result.nickname}</p>

				<div class="bg-gray-200 text-xs rounded px-2 inline-block">{result.big_classroom_type}</div>

				<div class="bg-gray-50 rounded p-4 my-2">
					<p class="text-gray-500 text-sm">Registered students: {result.students.length} / {map[result.big_classroom_type]}</p>
					{#each result.students as s}
						<p>{s.nickname}</p>
					{/each}
				</div>
				<div class="mt-4 text-sm text-gray-500">{result.description_hk}</div>
				<button class="button mt-4" on:click={onReg}>Register</button>
			</div>
		{:else}
			<p class="p-4">this is not a big classroom</p>
		{/if}
	{/if}
</div>