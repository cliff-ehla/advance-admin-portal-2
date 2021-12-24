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
	import dayjs from "dayjs";
	import {renderClassroomEvent} from "$lib/calendar/shared-function/classroom-event-content.js";

	const {openPopper} = getContext('popper')
	let calendar

	$: {
		console.log($big_class_events)
	}

	const init = async (node) => {
		const eventContent = (arg) => {
			const {extendedProps, start} = arg.event
			const type = extendedProps.type
			let wrapper = document.createElement('div')
			wrapper.classList.add('flex', 'items-center', 'w-full', 'overflow-hidden')

			if (type === 'classroom') {
				renderClassroomEvent(wrapper, start, extendedProps)
			}
			return {
				domNodes: [wrapper]
			}
		}
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
			events: $big_class_events
		})
		calendar.render()
	}

	const onToggleTutor = async (tutor) => {
		const events = await tutor_event_store.callIfNoCache(fetch, tutor.user_id)
		console.log('events', events)
		calendar.addEventSource([{
			start: dayjs().format('YYYY-MM-DD'),
			title: 'hihi',
		}])
		// calendar.addEventSource(events)
	}
</script>

<div class="p-4">
	<div class="absolute w-48 left-0">
		<div class="grid grid-cols-1 gap-2">
			{#each $classroom_analytic.by_level as lv}
				<div class="border border-gray-300 px-1 py-2 flex justify-between">

					<div>{lv.level}</div>
					<div>{lv.lesson_count}</div>
				</div>
			{/each}
		</div>
		<div class="mt-4">
			{#each $tutor_store as t}
				<img on:click={() => {onToggleTutor(t)}} src={tutor_store.getTutorProfilePic(t.user_id)} class="w-12 h-12 rounded-full inline-block m-1">
			{/each}
		</div>
	</div>
	<div class="ml-48" use:init></div>
</div>