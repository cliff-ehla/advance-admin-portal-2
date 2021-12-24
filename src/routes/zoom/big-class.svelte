<script context="module">
	import {big_class_store, big_class_events, classroom_analytic} from "$lib/store/big-class-store.js";

	export const load = async ({fetch}) => {
		await big_class_store.callIfNoCache(fetch)
		return true
	}
</script>

<script>
	import {tutor_store} from "../../store/tutor-store";
	import BigClassLessonMenu from '$lib/calendar/big-class-leson-menu.svelte'
	import {getContext} from 'svelte'
	import dayjs from "dayjs";
	import tippy from "tippy.js";
	const {openPopper} = getContext('popper')

	const init = async (node) => {
		const eventContent = (arg) => {
			let wrapper = document.createElement('div')
			wrapper.classList.add('flex', 'items-center', 'w-full', 'overflow-hidden')
			let content = document.createElement('div')
			content.classList.add('ml-1')
			content.style.width = 'calc(100% - 40px)'
			let content_upper = document.createElement('div')
			content_upper.classList.add('flex', 'items-center')
			let content_bottom = document.createElement('div')
			content_bottom.innerHTML = arg.event.extendedProps.cat
			content_bottom.classList.add('text-xs', 'overflow-hidden', 'overflow-ellipsis', 'whitespace-nowrap')
			tippy(content_bottom, {
				content: arg.event.extendedProps.cat
			})
			let time_el = document.createElement('div')
			time_el.innerHTML = dayjs(arg.event.start).add(8, 'hour').format('h:mma')
			let size_el = document.createElement('div')
			let reg_user_cnt = arg.event.extendedProps.reg_user_cnt
			let label_color = reg_user_cnt >= 3 ? 'bg-yellow-300' : reg_user_cnt == 2 ? 'bg-yellow-200' : reg_user_cnt == 1 ? 'bg-yellow-100' : 'bg-red-200'
			size_el.classList.add(label_color, 'px-1', 'rounded' , 'leading-tight', 'text-xs')
			size_el.innerHTML = `${arg.event.extendedProps.reg_user_cnt}/${arg.event.extendedProps.student_size}`

			let level_el = document.createElement('div')
			level_el.classList.add('bg-gray-100', 'px-1', 'rounded', 'ml-auto' , 'leading-tight', 'overflow-hidden', 'text-xs', 'border', 'border-gray-300')
			// level_el.style.maxWidth = '60px'
			level_el.innerHTML = arg.event.extendedProps.level
			tippy(level_el, {
				content: arg.event.extendedProps.level
			})

			content_upper.appendChild(time_el)
			content_upper.appendChild(level_el)
			content_upper.appendChild(size_el)
			if (arg.event.extendedProps.no_material) {
				const icon_el = document.createElement('div')
				icon_el.innerHTML = '!'
				icon_el.classList.add('w-4', 'h-4', 'bg-red-500', 'text-white', 'flex', 'items-center', 'justify-center', 'font-bold', 'ml-0.5')
				tippy(icon_el, {
					content: 'No material'
				})
				content_upper.appendChild(icon_el)
			}
			content.appendChild(content_upper)
			content.appendChild(content_bottom)
			let img_el = document.createElement('img')
			img_el.src = tutor_store.getTutorProfilePic(arg.event.extendedProps.tutor_id)
			img_el.classList.add('h-8', 'w-8', 'rounded-full')
			img_el.title = arg.event.extendedProps.tutor_name
			tippy(img_el, {
				content: arg.event.extendedProps.tutor_name
			})
			wrapper.appendChild(img_el)
			wrapper.appendChild(content)
			return {
				domNodes: [wrapper]
			}
		}
		let cal = new FullCalendar.Calendar(node, {
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
		cal.render()
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
	</div>
	<div class="ml-48" use:init></div>
</div>