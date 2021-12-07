<script>
	import {getContext} from 'svelte'
	const {closeModal} = getContext('simple-modal')
	import {http} from "$lib/http";

	export let parent_id
	let ticket_amt, lesson_fee, app_fee
	let loading

	const onConfirm = async () => {
		await http.post(fetch, '/courseApi/create_course_ticket', {
			payer_id: parent_id,
			ticket_amt,
			lesson_fee,
			app_fee,
		})
		closeModal()
	}
</script>


<input class="input block" type="text" placeholder="App fee" bind:value={app_fee}/>
<input class="input block" type="text" placeholder="Lesson fee" bind:value={lesson_fee}/>
<input class="input block" type="text" placeholder="Ticker Amount" bind:value={ticket_amt}/>
<button on:click={onConfirm}>Confirm</button>