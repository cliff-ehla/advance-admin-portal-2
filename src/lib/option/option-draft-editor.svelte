<script>
	import {http} from "$lib/http";
	import {getContext} from 'svelte'
	import SelectionBox from '$lib/ui-elements/selection-box.svelte'
	import Button from '$lib/ui-elements/button.svelte'
	const {closeModal} = getContext('simple-modal')
	import {level_options_store, gender_options_store} from "../../store/level-options";
	import {course_title_options_store} from "../../store/course-title-options-store";
	import TemplateTextBox from '../../lib/ui-elements/template-text-box.svelte'
	import CreateUserForm from '$lib/student/create-new-user.svelte'

	export let s_nickname
	export let course
	export let material
	export let age
	export let lv
	export let gender
	export let general_message
	export let grouper_id
	export let parent_mobile
	export let onSaveSuccess = () => {}
	export let onCreateUserSuccess = () => {}

	const onSaveDraftClick = async () => {
		await http.post(fetch, '/zoomApi/cache_reserved_data', {
			grouper_id, s_nickname, gender, course, material, age, lv, general_message
		}, {
			notification: '資料已存全'
		})
		closeModal()
		onSaveSuccess({grouper_id, s_nickname, gender, course, material, age, lv, general_message})
	}

	const onUserCreated = async (e) => {
		const {user_id} = e.detail
		await http.post(fetch, '/zoomApi/update_zoom_trial_option', {
			student_id: user_id,
			grouper_id
		}, {
			notification: '已把剛創建的學生加入到課堂中'
		})
		http.get(fetch, '/adminApi/list_students_with_ticket_info')
		closeModal()
		onCreateUserSuccess()
	}

	const toSlug = string => {
		return string.toLowerCase()
				.replace(/ /g, '')
				.replace(/[^\w-]+/g, '');
	}
</script>

<div class="flex">
	<div class="px-4 py-8 w-72 border-r border-gray-300 bg-gray-100">
		<p class="font-bold mb-4">暫存起草</p>
		<p class="label">Nickname</p>
		<input bind:value={s_nickname}
		       class="input"
		       placeholder="Nickname"
		       type="text"/>

		<p class="label">Course</p>
		<TemplateTextBox value={course} on:input={e => {course = e.detail}} options={$course_title_options_store} placeholder="Course title"/>

		<p class="label">Material</p>
		<input bind:value={material}
		       class="input"
		       placeholder="Material"
		       type="text"/>

		<p class="label">Age</p>
		<input bind:value={age}
		       class="input"
		       placeholder="Age"
		       type="text"/>

		<p class="label">Level</p>
		<SelectionBox placeholder="level" options={$level_options_store} selected_value={lv} on:input={e => {lv = e.detail}}/>

		<p class="label">Gender</p>
		<SelectionBox placeholder="gender" options={$gender_options_store} selected_value={gender} on:input={e => {gender = e.detail}}/>

		<p class="label">Additional note</p>
		<textarea bind:value={general_message}
		          class="border border-gray-300 rounded px-4 py-2 w-full h-32"
		          placeholder="Remark"
		></textarea>

		<div class="flex mt-4 w-full">
			<Button class="flex-1 border border-gray-300 px-4 py-2 rounded" on:click={onSaveDraftClick}>暫存資料</Button>
		</div>
	</div>

	<div class="py-8 px-4">
		<p class="font-bold mb-4">建立用戶</p>
		<CreateUserForm on:created={onUserCreated}
		                nickname={s_nickname}
		                username={s_nickname ? toSlug(s_nickname) : ''}
		                parent_username={s_nickname ? toSlug(s_nickname) + '_p' : ''}
		                parent_nickname={s_nickname + ' Parent'}
		                {gender}
		                {parent_mobile}
		                level={lv}/>
	</div>
</div>

<style>
	.label {
			@apply text-sm text-gray-500 mt-2 mb-0.5;
	}
	input {
			@apply w-full;
	}
</style>