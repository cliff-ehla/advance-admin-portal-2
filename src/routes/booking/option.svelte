<script context="module">
	import {http, onFail} from "$lib/http";

	export const load = async ({page, fetch}) => {
		const {data, success, debug} = await http.post(fetch, '/zoomApi/list_zoom_trial_option')
		if (!success) return onFail(debug)
		return {
			props: {
				option_list: data
			}
		}
	}
</script>

<script>
	import dayjs from "dayjs";
	import utc from "dayjs/plugin/utc.js";
	dayjs.extend(utc)
	import ConfirmedOptionPreview from '$lib/option/confirmed-option-preview.svelte'
	import OptionsPreview from '$lib/option/options-preview.svelte'


	export let option_list
	$: not_yet_locked_list = option_list.filter(item => !!item.auto_delete_date)
	$: locked_list = option_list.filter(item => !item.auto_delete_date && !item.student_id).sort((a,b) => a.start_date > b.start_date ? -1 : 1)
	$: ready_list = option_list.filter(item => !!item.student_id)

	const reloadData = async () => {
		let {data} = await http.post(fetch, '/zoomApi/list_zoom_trial_option')
		option_list = data
	}
</script>

<div class="bg-gray-100">
	<div class="max-w-screen-lg px-4 py-8">
		<div class="flex">
			<div class="w-80">
				<p class="font-bold mb-4">未確定的時段</p>
				<div class="grid gap-4">
					{#each not_yet_locked_list as option}
						<OptionsPreview on:reload={reloadData} {option}/>
					{/each}
				</div>
			</div>
			<div class="w-80 ml-4">
				<p class="font-bold mb-4">確定的時段</p>
				<div class="grid gap-4">
					{#each locked_list as option}
						<ConfirmedOptionPreview on:reload={reloadData} {option}/>
					{/each}
				</div>
			</div>
			<div class="w-80 ml-4">
				<p class="font-bold mb-4">準備起堂</p>
				<div class="grid gap-4">
					{#each ready_list as option}
						<ConfirmedOptionPreview {option}/>
					{/each}
				</div>
			</div>
		</div>
	</div>
</div>