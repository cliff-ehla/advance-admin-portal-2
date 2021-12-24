<script context="module">
	import {big_class_store, big_class_events, classroom_analytic} from "$lib/store/big-class-store.js";

	export const load = async ({fetch}) => {
		await big_class_store.callIfNoCache(fetch)
		return true
	}
</script>

<script>
	import {tutor_store} from "../../store/tutor-store";
	import {tutor_event_store} from "$lib/store/tutor-event-store.js";
	import BigClassLessonMenu from '$lib/calendar/big-class-leson-menu.svelte'
	import {getContext} from 'svelte'
	import {tooltip} from "$lib/aciton/tooltip.js";
	import {eventContent} from "$lib/calendar/shared-function/event-content.js";

	const {openPopper} = getContext('popper')
	let calendar

	const CLASSROOM = 'classroom'
	const INDIVIDUAL = 'individual'
	let big_class_on = true
	let overlay_tutor_id // TODO in store?

	const init = async (node) => {
		calendar = new FullCalendar.Calendar(node, {
			initialView: 'dayGridMonth',
			eventContent,
			eventClick: async ({el, event}) => {
				openPopper(el, BigClassLessonMenu, {
					zoom_id: event.extendedProps.zoom_id
				}, {
					placement: "right"
				})
			},
			eventSources: [
				{
					events: $big_class_events,
					id: CLASSROOM
				}
			]
		})
		calendar.render()
	}

	const onToggleTutor = async (tutor) => {
		if (overlay_tutor_id) {
			let individual_tutor_events = calendar.getEventSourceById(INDIVIDUAL)
			individual_tutor_events.remove()
			overlay_tutor_id = null
		} else {
			overlay_tutor_id = tutor.user_id
			await tutor_event_store.callIfNoCache(fetch, {tutor_id: tutor.user_id})
			const events = tutor_event_store.getTutorEventsByMonth(tutor.user_id, '2021-12', {
				is_grid_view: true
			})
			calendar.addEventSource({
				id: INDIVIDUAL,
				events
			})
		}
	}

	const onToggleBigClass = (e) => {
		if (e.target.checked) {
			const source = calendar.getEventSourceById(CLASSROOM)
			source.remove()
		} else {
			calendar.addEventSource({
				id: CLASSROOM,
				events: $big_class_events
			})
		}
	}
</script>

<div>
	<div class="absolute w-48 left-0 p-2">
		<div class="my-4">
			<div class="bg-blue-100 border border-blue-200">
				<div class="p-2 bg-blue-50 border border-blue-200 flex items-center">
					<input id="big-class" type="checkbox" bind:checked={big_class_on} on:input={onToggleBigClass}>
					<label for="big-class" class="ml-4 cursor-pointer">Big class</label>
				</div>
				<div class="p-1 bg-blue-100">
					{#each $classroom_analytic.by_level as lv}
						<div class="flex items-center px-2 py-0.5">
							<input type="checkbox" >
							<label class="ml-4">{lv.level} ({lv.lesson_count})</label>
						</div>
					{/each}
				</div>
			</div>
		</div>

		<div class="my-4">
			<div class="bg-blue-100 border border-blue-200">
				<div class="flex items-center p-2 bg-blue-50">
					<input type="checkbox" bind:checked={overlay_tutor_id}>
					<label class="ml-4">Individual</label>
				</div>

				<div class="p-1 bg-blue-100">
					{#each $tutor_store as t}
						<img on:click={() => {onToggleTutor(t)}}
						     use:tooltip={tutor_store.getTutorName(t.user_id)}
						     src={tutor_store.getTutorProfilePic(t.user_id)}
						     class:opacity-80={overlay_tutor_id !== t.user_id}
						     class:active={overlay_tutor_id === t.user_id}
						     class="w-12 h-12 rounded-full inline-block my-1 mx-0.5">
					{/each}
				</div>
			</div>
		</div>
	</div>
	<div class="py-4 px-2 ml-48" use:init></div>
</div>

<style>
	.active {
		@apply border-4 border-blue-500 shadow;
	}
</style>