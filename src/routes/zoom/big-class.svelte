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
					events: $big_class_events.events,
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
			const events = tutor_event_store.getTutorEvents(tutor.user_id, {
				is_grid_view: true
			})
			calendar.addEventSource({
				id: INDIVIDUAL,
				events
			})
		}
	}

	const onToggleBigClass = (e) => {
		big_class_events.clearLevelFilters()
		reRenderEvents()
	}

	const onClearCodeFilter = () => {
		big_class_events.clearCodeFilters()
		reRenderEvents()
	}

	const onToggleLevel = (lv) => {
		big_class_events.toggleLevelFilter(lv)
		reRenderEvents()
	}

	const onToggleCode = (code) => {
		big_class_events.toggleCodeFilter(code)
		reRenderEvents()
	}

	const reRenderEvents = () => {
		const source = calendar.getEventSourceById(CLASSROOM)
		if (source) {
			source.remove()
			calendar.addEventSource({
				id: CLASSROOM,
				events: $big_class_events.events
			})
		}
	}
</script>

<div>
	<div class="absolute w-48 left-0 p-2">
		<div class="my-4">
			<div class="bg-blue-100 border border-blue-200">
				<div class="p-2 bg-blue-50 border border-blue-200 flex items-center">
					<input id="big-class" type="checkbox" bind:checked={$big_class_events.level_filter_off} on:input={onToggleBigClass}>
					<label for="big-class" class="ml-4 cursor-pointer">全部程度</label>
				</div>
				<div class="p-1 bg-blue-100">
					{#each $big_class_events.level_filters as obj}
						<div class="flex items-center px-2 py-0.5 cursor-pointer hover:bg-white">
							<input id={obj.key} on:input={() => {onToggleLevel(obj.key)}} type="checkbox" checked={obj.selected}>
							<label for={obj.key} class="ml-4 cursor-pointer">{obj.key} ({obj.count})</label>
						</div>
					{/each}
				</div>
			</div>
		</div>

		<div class="bg-blue-100 border border-blue-200">
			<div class="p-2 bg-blue-50 border border-blue-200 flex items-center">
				<input id="code" type="checkbox" bind:checked={$big_class_events.code_filter_off} on:input={onClearCodeFilter}>
				<label for="code" class="ml-4 cursor-pointer">全部Course</label>
			</div>
			<div class="p-1 bg-blue-100">
				{#each $big_class_events.code_filters as f}
					<div class="flex items-center px-2 py-0.5 cursor-pointer hover:bg-white">
						<input id={f.key} type="checkbox" checked={f.selected} on:input={() => {onToggleCode(f.key)}}>
						<label for={f.key} class="ml-4 cursor-pointer">{f.key} ({f.count})</label>
					</div>
				{/each}
			</div>
		</div>

<!--		<div class="my-4">-->
<!--			<div class="bg-blue-100 border border-blue-200">-->
<!--				<div class="flex items-center p-2 bg-blue-50">-->
<!--					<input type="checkbox" bind:checked={overlay_tutor_id}>-->
<!--					<label class="ml-4">Individual</label>-->
<!--				</div>-->

<!--				<div class="p-1 bg-blue-100">-->
<!--					{#each $tutor_store as t}-->
<!--						<img on:click={() => {onToggleTutor(t)}}-->
<!--						     use:tooltip={tutor_store.getTutorName(t.user_id)}-->
<!--						     src={tutor_store.getTutorProfilePic(t.user_id)}-->
<!--						     class:opacity-80={overlay_tutor_id !== t.user_id}-->
<!--						     class:active={overlay_tutor_id === t.user_id}-->
<!--						     class="w-12 h-12 rounded-full inline-block my-1 mx-0.5">-->
<!--					{/each}-->
<!--				</div>-->
<!--			</div>-->
<!--		</div>-->
	</div>
	<div class="py-4 px-2 ml-48" use:init></div>
</div>

<style>
	.active {
		@apply border-4 border-blue-500 shadow;
	}
</style>