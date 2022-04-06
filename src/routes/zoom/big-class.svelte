<script context="module">
	import {big_class_store, big_class_events, classroom_analytic} from "$lib/store/big-class-store.js";
	import {big_class_mapper} from "$lib/store/big-class-mapper.js";
	import dayjs from "dayjs";

	export const load = async ({fetch}) => {
		await big_class_mapper.fetchRcLevelMapping(fetch)
		await big_class_store.callIfNoCache(fetch, {
			month: dayjs().format('YYYY-MM')
		})
		return true
	}
</script>

<script>
	import BigClassLessonMenu from '$lib/calendar/big-class-leson-menu.svelte'
	import SelectedClassroom from '$lib/calendar/selected-classroom.svelte'
	import {getContext, onMount} from 'svelte'
	import {eventContent} from "$lib/calendar/shared-function/event-content.js";
	import Icon from '$lib/ui-elements/icon.svelte'
	const {openModal, closeModal} = getContext('simple-modal')
	let calendar
	let calendar_month = dayjs().format('MMMM YYYY')

	const CLASSROOM = 'classroom'

	onMount(() => {
		document.addEventListener('refresh-calendar', fetchAndReRender)
		return () => {
			document.removeEventListener('refresh-calendar', fetchAndReRender)
		}
	})

	const init = async (node) => {
		calendar = new FullCalendar.Calendar(node, {
			initialView: 'dayGridMonth',
			headerToolbar: false,
			eventContent,
			eventClick: async ({el, event}) => {
				openModal(BigClassLessonMenu, {
					item_id: event.extendedProps.item_id,
					selected: event.extendedProps.selected,
					zoom_id: event.extendedProps.zoom_id,
					tutor_group_id: event.extendedProps.tutor_group_id,
					tutor_course_id: event.extendedProps.tutor_course_id,
					description_code_short_id: event.extendedProps.description_code_short_id,
					level: event.extendedProps.level,
					tutor_id: event.extendedProps.tutor_id,
					onToggle: reRenderEvents
				}, {
					overflow: 'initial',
					width: '900px',
					padding: '0',
					closeButton: false
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

	const onToggleTutor = (key) => {
		big_class_events.toggleTutorFilter(key)
		reRenderEvents()
	}

	const onToggleIsFull = () => {
		big_class_events.toggleIsFull()
		reRenderEvents()
	}

	const reRenderEvents = () => {
		const source = calendar.getEventSourceById(CLASSROOM)
		if (source) {
			source.remove()
		}
		calendar.addEventSource({
			id: CLASSROOM,
			events: $big_class_events.events
		})
	}

	const fetchAndReRender = async () => {
		big_class_store.clear()
		await big_class_store.callIfNoCache(fetch, {
			month: dayjs(calendar.getDate()).format('YYYY-MM')
		})
		reRenderEvents()
	}

	const showSelectedEvents = () => {
		openModal(SelectedClassroom, {}, {
			width: '600px'
		})
	}

	const onClearAllSelection = () => {
		big_class_events.clearAllSelection()
		reRenderEvents()
	}

	const onChangeMonth = async (type) => {
		if (type === 'next') {
			calendar.next()
		} else {
			calendar.prev()
		}
		calendar_month = dayjs(calendar.getDate()).format('MMMM YYYY')
		await big_class_store.callIfNoCache(fetch, {
			month: dayjs(calendar.getDate()).format('YYYY-MM')
		})
		reRenderEvents()
	}
 </script>

<div>
	<div class="absolute w-56 left-0 p-2 overflow-y-scroll" style="max-height: calc(100vh - 72px)">
		<div class="p-2 {$big_class_events.selected_events.length ? 'cursor-pointer bg-yellow-50 border-yellow-400 hover:bg-yellow-100' : 'bg-gray-200'} border-2 flex items-center mt-2">
			<div class="flex-1" on:click={showSelectedEvents}>推介信息 ({$big_class_events.selected_events.length})</div>
			{#if $big_class_events.selected_events.length}
				<button on:click={onClearAllSelection} class="ml-auto flex-shrink-0 hover:text-red-500">
					<Icon name="close" className="w-3"/>
				</button>
			{/if}
		</div>

		<div class="bg-blue-100 border border-blue-200 my-4">
			<div class="p-2 bg-blue-50 border border-blue-200 flex items-center">
				<input id="is_full" type="checkbox" checked={$big_class_events.exclude_is_full} on:input={onToggleIsFull}>
				<label for="is_full" class="ml-4 cursor-pointer">撇除滿員</label>
			</div>
		</div>

		<div class="my-4">
			<div class="bg-blue-100 border border-blue-200">
				<div class="p-2 bg-blue-50 border border-blue-200 flex items-center">
					<input id="big-class" type="checkbox" checked={$big_class_events.level_filter_off} on:input={onToggleBigClass}>
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

		<div class="bg-blue-100 border border-blue-200 my-4">
			<div class="p-2 bg-blue-50 border border-blue-200 flex items-center">
				<input id="code" type="checkbox" checked={$big_class_events.code_filter_off} on:input={onClearCodeFilter}>
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

		<div class="bg-blue-100 border border-blue-200 my-4">
			<div class="p-2 bg-blue-50 border border-blue-200 flex items-center">
				<input id="code" type="checkbox" checked={$big_class_events.tutor_filter_off} on:input={onClearCodeFilter}>
				<label for="code" class="ml-4 cursor-pointer">全部Tutor</label>
			</div>
			<div class="p-1 bg-blue-100">
				{#each $big_class_events.tutor_filters as f}
					<div class="flex items-center px-2 py-0.5 cursor-pointer hover:bg-white">
						<input id={f.key} type="checkbox" checked={f.selected} on:input={() => {onToggleTutor(f.key)}}>
						<label for={f.key} class="ml-4 cursor-pointer text-sm">{f.label} ({f.count})</label>
					</div>
				{/each}
			</div>
		</div>
	</div>


	<div class="py-2 px-2 ml-56">
		<div class="flex-1 flex items-center justify-between px-2 mb-2">
			<button class="transform rotate-180 w-12 h-12 hover:bg-blue-500 hover:text-white rounded-full bg-gray-100 border border-gray-300 flex items-center justify-center" on:click={() => {onChangeMonth('prev')}}>
				<Icon className="w-4" name="right"/>
			</button>
			<div class="flex-1 flex items-center justify-center" style="font-size: 1.6em">
				<p class="ml-2 leading-none">{calendar_month}</p>
			</div>
			<button class="w-12 h-12 hover:bg-blue-500 hover:text-white rounded-full bg-gray-100 border border-gray-300 flex items-center justify-center" on:click={() => {onChangeMonth('next')}}>
				<Icon className="w-4" name="right"/>
			</button>
		</div>
		<div use:init></div>
	</div>
</div>