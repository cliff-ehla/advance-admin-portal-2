<script>
	import {http} from "$lib/http.js";
	import {student_store} from "../../store/student-store.js";

	export let zoom_id
	export let tutor_group_id
	import {onMount} from 'svelte'
	import Preview from '$lib/student/student-preview.svelte'
	import Dropdown from '$lib/ui-elements/dropdown3.svelte'
	import Icon from '$lib/ui-elements/icon.svelte'
	import StudentSelectionBox from '$lib/student/student-selection-box.svelte'
	import {getContext} from 'svelte'
	const {openModal, closeModal} = getContext('simple-modal')

	let students

	onMount(async () => {
		const {data} = await http.post(fetch, '/zoomApi/zoom_detail', {
			wrapper_id: zoom_id
		})
		students = data.students
		students = students.map(s => student_store.getStudent(s.user_id))
		students = students.filter(s => !!s)
	})

	const onReg = async (student_id) => {
		await http.post(fetch, '/courseApi/reg_registrable_classroom', {
			tutor_group_id,
			child_id: student_id
		}, {
			notification: '成功幫佢Reg堂'
		})
		document.dispatchEvent(new CustomEvent('refresh-calendar', {
			bubbles: true,
			cancelable: true
		}))
		closeModal()
	}

	const onUnReg = async (student_id) => {
		await http.post(fetch, '/courseApi/unreg_registrable_classroom', {
			tutor_group_id,
			child_id: student_id
		}, {
			notification: '成功幫佢UnReg堂'
		})
		document.dispatchEvent(new CustomEvent('refresh-calendar', {
			bubbles: true,
			cancelable: true
		}))
		closeModal()
	}
</script>

<div class="bg-white shadow-lg p-4" style="min-width: 400px">
	<h1 class="font-bold mb-4">報了這堂的學生：</h1>
	<div class="overflow-auto mb-4" style="max-height: 600px">
		{#if students}
			{#if students.length}
				{#each students as s}
					<div class="flex items-center">
						<Preview {s}/>
						<Dropdown placement="bottom-end">
							<button slot="activator" class="w-10 h-10 flex items-center justify-center">
								<Icon className="w-4" name="more"/>
							</button>
							<div class="dropdown">
								<div on:click={() => {onUnReg(s.student_id)}} class="px-4 py-2 hover:text-gray-100 hover:text-red-500 cursor-pointer">Delete</div>
							</div>
						</Dropdown>
					</div>
				{/each}
			{:else}
				冇人報
			{/if}
		{:else}
			loading...
		{/if}
	</div>
	<h1 class="font-bold mb-2">加人：</h1>
	<StudentSelectionBox with_ticket_only on:input={e => {onReg(e.detail)}}/>
</div>


