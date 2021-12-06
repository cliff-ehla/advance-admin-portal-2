<script>
	import {onMount} from 'svelte'
	import {http} from "../helpers/http";
	import dayjs from "dayjs";

	let record_list

	onMount(async () => {
		let {data} = await http.post('courseApi/list_voucher', {
			start_date: dayjs().format('YYYY-MM-DD HH:mm:ss'),
			end_date: dayjs().add(1, 'month').format('YYYY-MM-DD HH:mm:ss')
		})
		record_list = data
	})
</script>

{#if record_list}
	{#if record_list.length}
		{#each record_list as r}
			<p>hi</p>
		{/each}
	{:else}
		<p>no data</p>
	{/if}
{:else}
	loading
{/if}