<script>
	import {http} from "$lib/http.js";
	import {student_store} from "../../store/student-store.js";

	export let zoom_id
	export let tutor_group_id
	export let tutor_course_id
	export let tutor_id
	export let level
	export let description_code_short_id
	export let selected = false
	export let onToggle = () => {}
	import {onMount} from 'svelte'
	import {tooltip} from "$lib/aciton/tooltip.js";
	import Preview from '$lib/student/student-preview.svelte'
	import Dropdown from '$lib/ui-elements/dropdown3.svelte'
	import Icon from '$lib/ui-elements/icon.svelte'
	import Spinner from '$lib/ui-elements/spinner.svelte'
	import StudentWithTickerSelectionBox from '$lib/student/user-with-ticket-selection-box.svelte'
	import {getContext} from 'svelte'
	import {dialog} from "$lib/store/dialog.js";
	import dayjs from "dayjs";
	import utc from "dayjs/plugin/utc.js";
	import {big_class_events} from "$lib/store/big-class-store.js";
	import {sentry} from "$lib/sentry.js";
	import {tutor_store} from "../../store/tutor-store.js";
	import {capitalize} from '$lib/helper/capitalize.js'

	dayjs.extend(utc)
	const {openModal, closeModal} = getContext('simple-modal')

	let students
	let max_students
	let res
	$: is_full = res ? max_students === students.length : false

	onMount(() => {
		fetchData()
	})

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
		console.log(students)
	}

	const onReg = async (student_id, is_reg) => {
		let message = is_reg ? '係咪Reg?' : '係咪UnReg?'
		let notification = is_reg ? '成功幫佢Reg堂?' : '成功幫佢UnReg堂?'
		const url = is_reg ? '/courseApi/reg_registrable_classroom' : '/courseApi/unreg_registrable_classroom'
		dialog.confirm({
			message,
			onConfirm: async () => {
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

	const toggleSelection = () => {
		if (!selected) {
			big_class_events.addSelection(zoom_id)
		} else {
			big_class_events.removeSelection(zoom_id)
		}
		onToggle()
		closeModal()
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
					<p class="text-sm text-gray-500 ml-2">{dayjs(res.start_date).format('DD MMM@HH:mm')}</p>
				</div>
			{/if}
		</div>
		<div class="ml-auto">
			<p class="text-xs mb-0.5">推介</p>
			<input type="checkbox" on:input={toggleSelection} checked={selected} class="w-6 h-6">
		</div>
	</div>
<!--	<p class="text-xs text-gray-500 mb-2">Zoom ID: {zoom_id}</p>-->
<!--	<p class="text-xs text-gray-500 mb-2">Tutor group ID: {tutor_group_id}</p>-->
	<div class="flex">
		<div class="flex-1">
			{#if students}
				<div class="flex items-center border-gray-300 border-b px-4 py-3">
					<div>Registered students： <span class="bg-blue-50 rounded px-1 text-sm py-0.5 text-blue-500">{students.length}/{max_students}</span></div>
					{#if is_full}
						<span class="ml-2 px-2 py-0.5 text-xs bg-red-500 text-white rounded">Full</span>
					{/if}
				</div>
				<div class="p-4 overflow-auto mb-4" style="max-height: 400px">
					{#if students.length}
						{#each students as student}
							<a use:tooltip={`Remaining ticket: ${student.student.r_t_amt}`} href="/students/{student.student.user_id}" class="inline-flex items-center mr-2 bg-gray-50 border border-blue-300 hover:border-blue-500 hover:bg-white rounded-full mt-1">
								<div class="w-8 h-8 rounded-full border-1 border-gray-300 relative shadow flex-shrink-0">
									<img src="/student-{student.student.gender}-icon.png" alt="gender" class="rounded-full border border-blue-500">
									<div class="absolute shadow font-bold border border-white -bottom-2 -right-4 ml-2 w-7 h-7 bg-blue-500 rounded-full text-sm cc text-white">{capitalize(student.student.level)}</div>
								</div>
								<div class="pl-5 pr-2 py-1">
									<div class="text-sm whitespace-nowrap">{student.student.student_nickname}</div>
									<div class="text-xs leading-none text-gray-500">{student.duration} days before</div>
								</div>
							</a>
						{/each}
					{:else}
						冇人報
					{/if}
				</div>
				<div class="px-4 py-2">
					<h1 class="font-bold mb-2">加入學生：</h1>
					<StudentWithTickerSelectionBox on:input={e => {onReg(e.detail.student_id, true)}}/>
				</div>
			{:else}
				<Spinner/>
			{/if}
		</div>
		<div class="w-72 border-l border-gray-300">
			<div class="flex items-center border-gray-300 border-b px-4 py-3">
				<p>Waiting list</p>
				<a href="/tutor/{tutor_id}/tutor-course/{tutor_group_id}" use:tooltip={'Manage'} class="ml-auto bg-blue-50 rounded-full w-6 h-6 cc">
					<Icon name="edit" className="w-3 text-blue-500"/>
				</a>
			</div>
		</div>
	</div>
	<button on:click={closeModal}>closeModal</button>
</div>


