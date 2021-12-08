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
	import {tutor_store} from "../../store/tutor-store";

	export let option_list

	const lockOption = (slot) => {
		console.log('slot', slot)
	}
</script>

<div class="max-w-screen-lg px-4 py-8">
	<div class="grid grid-cols-2 gap-4">
		{#each option_list as option}
			<div class="border border-gray-300 rounded-lg">
				<div class="flex items-center p-4">
					<div class="w-16 text-center overflow-hidden flex-shrink-0">
						<img src="{option.student_id ? '/student-f-icon.jpg' : '/phone-icon.png'}" alt="student"
						     class="rounded-full w-16 h-16 mx-auto border border-gray-500">
						<p class="font-bold text-center mt-1.5 text-xs whitespace-nowrap">
							{#if option.student_id}
								{option.student_nickname}
							{:else}
								{option.phone}
							{/if}
						</p>
						{#if !option.student_id}
							<button class="button-secondary">人物起稿</button>
						{/if}
					</div>

					<div class="ml-4 w-full">
						<p class="text-sm text-gray-700 border-b border-gray-300 mb-2">預約時段選擇:</p>
						{#each option.reserves as slot}
							<div class="flex items-center mb-1 text-sm">
								<a href="/tutor/{slot.teacher_id}/{dayjs().format('YYYY-MM')}">
									<img src={tutor_store.getTutorProfilePic(slot.teacher_id)} class="w-8 h-8 rounded-full" title={tutor_store.getTutorName(slot.teacher_id)}>
								</a>
								<div class="ml-2">
									<span class="font-bold">{dayjs.utc(slot.start_date).local().format('DD MMM (ddd)')}</span>,
									{dayjs.utc(slot.start_date).local().format('h:mma')} - {dayjs.utc(slot.end_date).local().format('h:mma')}
								</div>
								<div class="ml-auto">
									<button on:click={() => lockOption(slot)} class="button-secondary w-12">確定</button>
								</div>
							</div>
						{/each}
						<div class="text-xs mt-2">
							<p>備忘: {option.general_message || option.remark} <button class="button-secondary">修改</button></p>
							<p>建立者: {option.username}</p>
						</div>
					</div>
				</div>
			</div>
		{/each}
	</div>
</div>
