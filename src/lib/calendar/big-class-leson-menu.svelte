<script>
	import {http} from "$lib/http.js";
	import {student_store} from "../../store/student-store.js";

	export let zoom_id
	export let tutor_group_id
	import {onMount} from 'svelte'
	import {tooltip} from "$lib/aciton/tooltip.js";
	import Preview from '$lib/student/student-preview.svelte'
	import Dropdown from '$lib/ui-elements/dropdown3.svelte'
	import Icon from '$lib/ui-elements/icon.svelte'
	import StudentWithTickerSelectionBox from '$lib/student/user-with-ticket-selection-box.svelte'
	import {getContext} from 'svelte'
	import {dialog} from "$lib/store/dialog.js";
	import dayjs from "dayjs";
	import utc from "dayjs/plugin/utc.js";
	dayjs.extend(utc)
	const {openModal, closeModal} = getContext('simple-modal')

	let students

	onMount(() => {
		fetchData()
	})

	const fetchData = async () => {
		const {data} = await http.post(fetch, '/zoomApi/zoom_detail', {
			wrapper_id: zoom_id
		})
		students = data.students
		students = students.map(s => {
			return {
				date: dayjs.utc(s.reg_date).local().format('DD MMM YYYY'),
				duration: dayjs().diff(dayjs.utc(s.reg_date).local(), 'day'),
				student: student_store.getStudent(s.user_id)
			}
		})
		students = students.filter(s => !!s)
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
</script>

<div class="bg-white shadow-lg p-4" style="min-width: 400px">
	<h1 class="font-bold mb-4">報了這堂的學生：</h1>
	<div class="overflow-auto mb-4" style="max-height: 600px">
		{#if students}
			{#if students.length}
				{#each students as s}
					<div class="my-4">
						<div class="flex items-center">
							<Preview s={s.student}/>
							<Dropdown placement="bottom-end">
								<button slot="activator" class="w-10 h-10 flex items-center justify-center">
									<Icon className="w-4" name="more"/>
								</button>
								<div class="dropdown">
									<div on:click={() => {onReg(s.student_id, false)}} class="px-4 py-2 hover:text-gray-100 hover:text-red-500 cursor-pointer">Un-Reg</div>
								</div>
							</Dropdown>
						</div>
						<div class="-mt-4">
							<div class="inline-block text-sm" use:tooltip={s.date}>Registered {s.duration} days before</div>
						</div>
					</div>
				{/each}
			{:else}
				冇人報
			{/if}
		{:else}
			loading...
		{/if}
	</div>
	<h1 class="font-bold mb-2">加入學生：</h1>
	<StudentWithTickerSelectionBox on:input={e => {onReg(e.detail.student_id, true)}}/>
</div>


