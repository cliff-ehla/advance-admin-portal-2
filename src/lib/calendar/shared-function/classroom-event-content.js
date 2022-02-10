import tippy from "tippy.js";
import dayjs from "dayjs";
import {tutor_store} from "../../../store/tutor-store.js";

export const renderClassroomEvent = (wrapper, start, extendedProps) => {
	let content = document.createElement('div')
	content.classList.add('ml-1')
	content.style.width = 'calc(100% - 40px)'
	let content_upper = document.createElement('div')
	content_upper.classList.add('flex', 'items-center')
	let content_bottom = document.createElement('div')
	content_bottom.classList.add('flex', 'items-center')
	const code_el = document.createElement('div')
	code_el.classList.add('bg-gray-100', 'px-1', 'rounded' , 'leading-tight', 'overflow-hidden', 'text-xs', 'border', 'border-gray-300', 'flex-shrink-0', 'mr-1')
	code_el.innerHTML = extendedProps.code
	tippy(code_el, {
		content: extendedProps.cat
	})
	const material_el = document.createElement('div')
	material_el.innerHTML = extendedProps.material
	material_el.classList.add('text-xs', 'overflow-hidden', 'overflow-ellipsis', 'whitespace-nowrap')
	tippy(material_el, {
		content: extendedProps.material
	})
	content_bottom.appendChild(code_el)
	content_bottom.appendChild(material_el)
	let time_el = document.createElement('div')
	time_el.innerHTML = dayjs(start).add(8, 'hour').format('h:mma')
	let size_el = document.createElement('div')
	let reg_user_cnt = extendedProps.reg_user_cnt
	let label_color = reg_user_cnt >= 3 ? 'bg-yellow-300' : reg_user_cnt == 2 ? 'bg-yellow-200' : reg_user_cnt == 1 ? 'bg-yellow-100' : 'bg-red-200'
	size_el.classList.add(label_color, 'px-1', 'rounded' , 'leading-tight', 'text-xs')
	size_el.innerHTML = `${extendedProps.reg_user_cnt}/${extendedProps.student_size}`

	let level_el = document.createElement('div')
	level_el.classList.add('bg-gray-100', 'px-1', 'rounded', 'ml-auto' , 'leading-tight', 'overflow-hidden', 'text-xs', 'border', 'border-gray-300')
	level_el.innerHTML = extendedProps.level
	tippy(level_el, {
		content: extendedProps.level
	})

	content_upper.appendChild(time_el)
	content_upper.appendChild(level_el)
	content_upper.appendChild(size_el)
	if (extendedProps.no_material) {
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
	img_el.src = tutor_store.getTutorProfilePic(extendedProps.tutor_id)
	img_el.classList.add('h-8', 'w-8', 'rounded-full')
	img_el.title = extendedProps.tutor_name
	tippy(img_el, {
		content: extendedProps.tutor_name
	})
	if (extendedProps.selected) {
		wrapper.classList.add('bg-yellow-100', 'px-1', 'border-2', 'border-yellow-500')
	}
	wrapper.appendChild(img_el)
	wrapper.appendChild(content)
}