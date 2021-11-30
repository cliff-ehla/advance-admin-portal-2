<script>
	import {http} from "../../helpers/http";
	import {tutor_store} from "../../store/tutor-store";
	import dayjs from "dayjs";
	import utc from 'dayjs/plugin/utc.js'
	dayjs.extend(utc)

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
			let time_el = document.createElement('div')
			time_el.innerHTML = dayjs.utc(arg.event.start).local().format('h:mma')
			let size_el = document.createElement('div')
			let reg_user_cnt = arg.event.extendedProps.reg_user_cnt
			let label_color = reg_user_cnt >= 3 ? 'bg-yellow-300' : reg_user_cnt == 2 ? 'bg-yellow-200' : reg_user_cnt == 1 ? 'bg-yellow-100' : 'bg-gray-100'
			size_el.classList.add(label_color, 'px-1', 'rounded', 'ml-auto' , 'leading-tight')
			size_el.innerHTML = `${arg.event.extendedProps.reg_user_cnt}/${arg.event.extendedProps.student_size}`
			content_upper.appendChild(time_el)
			content_upper.appendChild(size_el)
			content.appendChild(content_upper)
			content.appendChild(content_bottom)
			let img_el = document.createElement('img')
			img_el.src = tutor_store.getTutorProfilePic(arg.event.extendedProps.tutor_id)
			img_el.classList.add('h-8', 'w-8', 'rounded-full')
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
				start_date: e.start_date
			}
			return {
				start: e.start_date,
				extendedProps
			}
		})

		let cal = new FullCalendar.Calendar(node, {
			initialView: 'dayGridMonth',
			eventContent,
			events
		})
		cal.render()
	}
</script>

<div use:init></div>