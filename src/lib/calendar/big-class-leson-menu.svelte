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
	import {dialog} from "$lib/store/dialog.js";
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
			onSuccess: () => {
				document.dispatchEvent(new CustomEvent('refresh-calendar', {
					bubbles: true,
					cancelable: true
				}))
				closeModal()
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
					<div class="flex items-center">
						<Preview {s}/>
						<Dropdown placement="bottom-end">
							<button slot="activator" class="w-10 h-10 flex items-center justify-center">
								<Icon className="w-4" name="more"/>
							</button>
							<div class="dropdown">
								<div on:click={() => {onReg(s.student_id, false)}} class="px-4 py-2 hover:text-gray-100 hover:text-red-500 cursor-pointer">Delete</div>
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
	<StudentSelectionBox with_ticket_only on:input={e => {onReg(e.detail, true)}}/>
</div>


