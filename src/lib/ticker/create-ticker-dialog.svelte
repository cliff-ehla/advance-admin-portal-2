<script>
	import {getContext} from 'svelte'
	const {closeModal} = getContext('simple-modal')
	import {http} from "$lib/http";
	import Button from '$lib/ui-elements/button.svelte'

	export let parent_id
	let ticket_amt, lesson_fee, app_fee

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

<h2 class="font-bold mb-4">Create ticket</h2>
<input class="input block mb-2" type="text" placeholder="App fee" bind:value={app_fee}/>
<input class="input block mb-2" type="text" placeholder="Lesson fee" bind:value={lesson_fee}/>
<input class="input block mb-2" type="text" placeholder="Ticker Amount" bind:value={ticket_amt}/>
<div class="text-right">
	<Button disabled={!(ticket_amt && lesson_fee)} on:click={onConfirm}>Confirm</Button>
</div>