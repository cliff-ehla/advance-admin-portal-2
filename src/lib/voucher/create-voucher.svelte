<script>
	import Button from '$lib/ui-elements/button.svelte'
	import SelectionBox from '$lib/ui-elements/selection-box.svelte'
	import {tutor_store} from "../../store/tutor-store.js";
	import {http} from "$lib/http.js";

	let voucher_type = 'TICKET', phone, lesson_fee, app_fee = 0, remark
	let ticket_amt
	let lesson_count, lesson_duration, teacher_id

	const type_option = ['TICKET', 'COURSE', 'TRIAL']

	const onConfirm = () => {
		http.post(fetch, '/voucherApi/create_voucher', {
			voucher_type,
			phone,
			lesson_fee,
			app_fee,
			remark,
			ticket_amt
		})
	}
</script>

<h2 class="mb-4 text-xl">Create voucher</h2>

<div class="flex mb-2">
	{#each type_option as option}
		<button class="button-secondary normal"
		        on:click={() => {voucher_type = option}}
		        class:active={option === voucher_type}>
			{option}
		</button>
	{/each}
</div>

<label>Phone</label>
<input class="input block mb-2" type="tel" placeholder="Phone" bind:value={phone}/>
<label>App fee</label>
<input class="input block mb-2" type="number" placeholder="App fee" bind:value={app_fee}/>
<label>Lesson fee</label>
<input class="input block mb-2" type="number" placeholder="Lesson fee" bind:value={lesson_fee}/>
{#if voucher_type === 'TICKET'}
	<label>Ticker amount</label>
	<input class="input block mb-2" type="number" placeholder="Ticker amount" bind:value={ticket_amt}/>
{:else if voucher_type === 'COURSE' || voucher_type === 'TRIAL'}
	<label>Lesson count</label>
	<input class="input block mb-2" type="number" placeholder="Lesson count" bind:value={lesson_count}/>
	<label>Lesson duration</label>
	<input class="input block mb-2" type="number" placeholder="Lesson duration" bind:value={lesson_duration}/>
	<label>老師</label>
	<SelectionBox selected_value={teacher_id}
	              on:input={e => {teacher_id = e.detail}}
	              label_key="nickname"
	              value_key="user_id"
	              options={$tutor_store}/>
{/if}
<label>Remark</label>
<textarea class="input block mb-2" type="number" placeholder="Remark" bind:value={lesson_fee}/>

<div class="text-right mt-8">
	<Button disabled={!(ticket_amt && lesson_fee)} on:click={onConfirm}>Confirm</Button>
</div>

<style>
	label {
		@apply text-sm text-gray-500;
	}
</style>