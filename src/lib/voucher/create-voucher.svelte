<script>
	import Button from '$lib/ui-elements/button.svelte'
	import SelectionBox from '$lib/ui-elements/selection-box.svelte'
	import {tutor_store} from "../../store/tutor-store.js";
	import {http} from "$lib/http.js";
	import {getContext} from 'svelte'
	const {openModal, closeModal} = getContext('simple-modal')
	import PhoneSelection from '$lib/student/phone-selection.svelte'

	export let voucher_type
	export let onSuccess = () => {}
	export let phone = undefined
	export let teacher_id = undefined

	let lesson_fee, app_fee = 0, remark
	let ticket_amt
	let payment_method
	let lesson_count = voucher_type === 'TRIAL' ? 1 : 0,
			lesson_duration
	$: base_info_valid = typeof lesson_fee === 'number' && typeof app_fee === 'number' && !!phone

	const onConfirm = async () => {
		await http.post(fetch, '/voucherApi/create_voucher', {
			voucher_type,
			phone,
			lesson_fee,
			lesson_count,
			app_fee,
			payment_method,
			remark,
			ticket_amt,
			teacher_id
		}, {
			notification: `成功起左張 Voucher 俾呢個電話 ${phone}`
		})
		closeModal()
		onSuccess()
	}
</script>

<img src="/{voucher_type.toLowerCase()}.png" alt="img" class="w-20 mb-2 mx-auto">
<h2 class="mb-6 text-xl text-center">Create voucher for <span class="text-black border-b-2 border-black">{voucher_type}</span></h2>
<div class="flex">
	<div>
		<label>Phone</label>
		<PhoneSelection {phone} on:input={e => {phone = e.detail}} wrapper_class="mb-2"/>
		<label>App fee</label>
		<input class="input block mb-2 w-full" type="number" placeholder="App fee" bind:value={app_fee}/>
		<label>Lesson fee</label>
		<input class="input block mb-2 w-full" type="number" placeholder="Lesson fee" bind:value={lesson_fee}/>
		<label>Payment method</label>
		<SelectionBox simple_array options={['Alipay', 'Bank Transfer', 'Payme']} selected_value={payment_method} on:input={e => {payment_method = e.detail}}/>
		<label>Remark</label>
		<textarea class="input block mb-2 w-full" placeholder="Remark" bind:value={remark}/>
	</div>
	<div class="ml-4 bg-gray-100 p-2">
		{#if voucher_type === 'TICKET'}
			<p class="text-xs font-bold uppercase mb-2">Ticket detail:</p>
			<label>Ticker amount</label>
			<input class="input block mb-2" type="number" placeholder="Ticker amount" bind:value={ticket_amt}/>
		{:else if voucher_type === 'COURSE' || voucher_type === 'TRIAL'}
			<p class="text-xs font-bold uppercase mb-2">Course detail:</p>
			{#if voucher_type === 'COURSE'}
				<label>Lesson count</label>
				<input class="input block mb-2" type="number" placeholder="Lesson count" bind:value={lesson_count}/>
			{/if}
			<label>Lesson duration</label>
			<input class="input block mb-2" type="number" placeholder="Lesson duration" bind:value={lesson_duration}/>
			<label>老師</label>
			<SelectionBox selected_value={teacher_id}
			              on:input={e => {teacher_id = e.detail}}
			              label_key="nickname"
			              value_key="user_id"
			              options={$tutor_store}/>
		{/if}
	</div>
</div>
<div class="text-right mt-8">
	{#if voucher_type === 'TICKET'}
		<Button disabled={!(base_info_valid && ticket_amt)} on:click={onConfirm}>Confirm</Button>
	{:else}
		<Button disabled={!(base_info_valid && lesson_duration && teacher_id)} on:click={onConfirm}>Confirm</Button>
	{/if}
</div>

<style>
	label {
		@apply text-sm text-gray-500;
	}
</style>