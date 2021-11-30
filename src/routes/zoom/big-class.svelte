<script>
	import {http} from "../../helpers/http";
	import {tutor_store} from "../../store/tutor-store";
	import BigClassLessonMenu from '$lib/calendar/big-class-leson-menu.svelte'
	import {getContext} from 'svelte'
	import dayjs from "dayjs";
	import tippy from "tippy.js";
	const {openPopper} = getContext('popper')

	const init = async (node) => {
		let {data} = await http.post('courseApi/list_registrable_classroom')
		let events = data.filter(d => !!d.start_date)
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
		events = events.map(e => {
			const extendedProps = {
				reg_user_cnt: e.reg_user_cnt,
				student_size: e.student_size,
				cat: e.sub_cat_alter,
				tutor_id: e.tutor_id,
				tutor_name: e.tutor_name,
				start_date: e.start_date,
				zoom_id: e.zoom_id,
				no_material: e.no_material,
				level: e.rc_level
			}
			return {
				start: e.start_date,
				extendedProps
			}
		})

		let cal = new FullCalendar.Calendar(node, {
			initialView: 'dayGridMonth',
			eventContent,
			eventClick: async ({el, event}) => {
				console.log(event.extendedProps.tutor_name)
				openPopper(el, BigClassLessonMenu, {
					zoom_id: event.extendedProps.zoom_id
				}, {
					placement: "right"
				})
			},
			events
		})
		cal.render()
	}
</script>

<div use:init></div>