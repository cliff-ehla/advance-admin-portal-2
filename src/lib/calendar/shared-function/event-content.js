import dayjs from "dayjs";
import {renderClassroomEvent} from "$lib/calendar/shared-function/classroom-event-content.js";

const genTimeEl = (arg) => {
	let time_el = document.createElement('b')
	let show_end_time = window.location.pathname.indexOf('/day/') > 0
	let text = dayjs(arg.event.start).format('h:mma')
	if (show_end_time) {
		text = text + '-' + dayjs(arg.event.end).format('h:mma')
	}
	time_el.innerText = text
	time_el.classList.add('mr-1')
	return time_el
}

const getStudentTitle = (extendedProps) => {
	let students = extendedProps.students
	return students.length > 1 ? `${students.length} students` : students.length === 1 ? students[0].nickname : ''
}

export const eventContent = (arg) => {
	const {extendedProps, start} = arg.event
	const type = extendedProps.type
	let wrapper = document.createElement('div')
	wrapper.classList.add('flex', 'items-center', 'w-full', 'overflow-hidden')
	if (type === 'classroom') {
		renderClassroomEvent(wrapper, start, extendedProps)
	} else if (extendedProps.type === 'book') {
		const arrayOfNotes = []
		let alert_el = document.createElement('span')
		if (extendedProps.actual_duration) {
			alert_el.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" viewBox="0 0 36 36" class="w-4 fill-current"><path d="M22.243 5L19.06 8.317l5.48.246-4.56 4.592c-.886-.527-1.258-.386-1.893-.386-2.93 0-5.26 2.426-5.26 5.354 0 .635-.167.967.36 1.854l-4.558 4.56-.314-5.478L5 22.243V31h8.757l3.182-3.318-5.48-.244 4.558-4.592c.887.527 1.26.385 1.894.385 2.928 0 5.258-2.425 5.258-5.353 0-.635.168-.967-.36-1.854l4.56-4.56.313 5.477L31 13.757V5h-8.757zm-1.06 13c0 1.758-1.425 3.182-3.183 3.182-1.757 0-3.182-1.425-3.182-3.182s1.425-3.182 3.182-3.182 3.182 1.425 3.182 3.182z"></path></svg>'
		} else if (extendedProps.is_cancel) {
			alert_el.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" viewBox="0 0 36 36" class="w-4 fill-current"><path d="M5.4 0L18 12.6 30.6 0 36 5.4 23.4 18 36 30.6 30.602 36l-12.6-12.6L5.4 36 0 30.6 12.602 18 0 5.4 5.4 0z"></path></svg>'
			alert_el.style.color = 'red'
		} else if (extendedProps.admin_remark) {
			alert_el.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" viewBox="0 0 36 36" class="w-4 fill-current"><path d="M35.92 13.756C35 5.882 26.23.396 16.33 1.503 6.432 2.613-.846 9.89.08 17.763c.487 4.163 3.17 7.66 7.052 9.864.19 1.744-.45 3.967-3.47 6.244-1.233.93 4.997 2.13 10.812-3.878 1.67.205 3.416.223 5.197.023 9.9-1.107 17.175-8.386 16.25-16.26zM9.225 18.23c-1.387 0-2.508-1.12-2.508-2.505s1.12-2.506 2.508-2.506c1.383 0 2.504 1.12 2.504 2.505s-1.122 2.506-2.504 2.506zm8.898 0c-1.383 0-2.506-1.12-2.506-2.505s1.123-2.506 2.506-2.506c1.385 0 2.508 1.12 2.508 2.505s-1.123 2.506-2.508 2.506zm8.902 0c-1.387 0-2.506-1.12-2.506-2.505s1.12-2.506 2.506-2.506c1.385 0 2.506 1.12 2.506 2.505s-1.12 2.506-2.506 2.506z"></path></svg>'
		}else if (extendedProps.t_no_show) {
			alert_el.innerHTML = '<svg viewBox="0 0 36 36" class="w-4 fill-current" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" clip-rule="evenodd" d="M20.9237 4.63869C19.6243 2.45377 16.3756 2.45377 15.0762 4.63869L0.457345 29.219C-0.842107 31.4039 0.782207 34.1351 3.38111 34.1351H32.6188C35.2177 34.1351 36.842 31.4039 35.5426 29.219L20.9237 4.63869ZM19.8163 18.4207H24.1761V15.7171H12.0344V18.4207H16.3145V30.2432H19.8163V18.4207Z"/></svg>'
		} else if (extendedProps.s_no_show) {
			alert_el.innerHTML = '<svg viewBox="0 0 36 36" class="w-4 fill-current" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" clip-rule="evenodd" d="M20.9237 4.63869C19.6243 2.45377 16.3756 2.45377 15.0762 4.63869L0.457345 29.219C-0.842107 31.4039 0.782207 34.1351 3.38111 34.1351H32.6188C35.2177 34.1351 36.842 31.4039 35.5426 29.219L20.9237 4.63869ZM19.7169 25.185C20.0827 25.471 20.2656 25.87 20.2656 26.3822C20.2656 26.8344 20.096 27.187 19.7568 27.4397C19.4242 27.6858 18.9686 27.8088 18.3899 27.8088C17.4854 27.8088 16.8302 27.6259 16.4245 27.2601C16.0255 26.8877 15.8259 26.3123 15.8259 25.5341H12.3141C12.3141 26.4919 12.5535 27.3399 13.0324 28.0782C13.518 28.8098 14.2363 29.3885 15.1874 29.8142C16.1452 30.2332 17.2127 30.4427 18.3899 30.4427C20.0594 30.4427 21.373 30.0802 22.3308 29.3552C23.2885 28.6303 23.7674 27.6326 23.7674 26.3622C23.7674 24.7726 22.9826 23.5255 21.4129 22.6209C20.7677 22.2485 19.943 21.9026 18.9387 21.5834C17.9343 21.2574 17.2326 20.9448 16.8336 20.6455C16.4345 20.3396 16.235 20.0004 16.235 19.6279C16.235 19.2022 16.4146 18.8531 16.7737 18.5804C17.1395 18.301 17.635 18.1613 18.2602 18.1613C18.8788 18.1613 19.3677 18.3243 19.7268 18.6502C20.0926 18.9761 20.2756 19.435 20.2756 20.027H23.7674C23.7674 19.1424 23.5379 18.3575 23.079 17.6725C22.6201 16.9807 21.9749 16.4487 21.1435 16.0762C20.3188 15.7037 19.3843 15.5175 18.3401 15.5175C17.2692 15.5175 16.3048 15.6904 15.4468 16.0363C14.5888 16.3755 13.9237 16.8544 13.4515 17.4729C12.9859 18.0848 12.7531 18.7932 12.7531 19.598C12.7531 21.2142 13.6942 22.4846 15.5765 23.4091C16.1552 23.6951 16.9001 23.9911 17.8113 24.297C18.7225 24.603 19.3577 24.899 19.7169 25.185Z"/></svg>'
		} else if (extendedProps.remark) {
			alert_el.innerHTML = '<svg class="w-4 fill-current" viewBox="0 0 36 36"><path d="M33.188 1.356l1.455 1.456c1.81 1.81 1.81 4.74 0 6.55l-2.547 2.546-8.006-8.004 2.55-2.547c1.805-1.81 4.74-1.81 6.548 0zM10.99 33.016l-8.006-8.008L22.634 5.36l8.006 8.005-19.65 19.65zM2.258 27.92l5.822 5.822L0 36l2.258-8.08z"></path></svg>'
		} else if (extendedProps.override_salary) {
			alert_el.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" viewBox="0 0 36 36" class="w-4 fill-current"><path d="M17.998 0C8.06 0 0 8.058 0 18 0 27.943 8.06 36 18 36c9.945 0 18-8.06 18-18 0-9.942-8.06-18-18-18zm0 33.412c-8.52 0-15.425-6.906-15.425-15.424 0-8.52 6.905-15.426 15.425-15.426s15.426 6.906 15.426 15.426c0 8.518-6.906 15.424-15.426 15.424zM18.983 27.546v-.003"></path><path d="M16 13.56v.002c0 1.493 1 2.07 1 2.35v-4.508c0 .137-1 .524-1 2.155zM18.896 20H19v4.558c1-.22 1.804-.635 1.804-2.15 0-1.607-1.272-2.408-1.908-2.408z"></path><path d="M17.998 3.562c-7.968.015-14.41 6.46-14.423 14.426.014 7.967 6.457 14.41 14.423 14.424 7.968-.016 14.412-6.457 14.428-14.424-.016-7.967-6.46-14.41-14.428-14.426zM19 27.546v1.237c0 .473-.097.217-.594.217h-.554c-.495 0-.852.254-.852-.217v-1.24c-1 0-4.67-.637-4.67-1.465 0-.084.068-.084.122-.25l.837-2.32c.026-.055.014-.223.125-.223.167 0 2.584 1.078 3.584 1.272V19.14c-1-.745-4.866-1.71-4.866-5.356C12.134 9.72 16 8.56 17 8.506V7.152c0-.473.357-.152.853-.152h.554c.496 0 .593-.323.593.152v1.354c1 .054 4.33.662 4.33 1.6 0 .11-.03.195-.084.307l-.858 1.88c-.056.137-.137.218-.245.218-.164 0-2.143-1.104-3.143-1.104v5.11c2 .885 4.838 2.072 4.838 5.61 0 3.84-2.838 5.114-4.838 5.42z"></path></svg>'
		} else if (extendedProps.trial_success_buy_time) {
			alert_el.innerHTML = '<svg class="w-4 fill-current" viewBox="0 0 36 36"><path d="M18 0C8.06 0 0 8.06 0 18s8.06 18 18 18 18-8.06 18-18S27.94 0 18 0zm-2.416 29L6 19.416l2.875-2.875 6.71 6.71 10.54-13.417L29 12.708 15.584 29z"></path></svg>'
		}
		alert_el.style.paddingRight = '4px'

		let title_el = document.createElement('i')
		if (extendedProps.big_classroom_type) {
			title_el.innerHTML = extendedProps.description_code_short_id
		} else {
			title_el.innerHTML = getStudentTitle(extendedProps)
			title_el.classList.add('whitespace-nowrap')
		}

		let time_el = genTimeEl(arg)

		if (alert_el.innerHTML) {
			arrayOfNotes.push(alert_el)
		}
		arrayOfNotes.push(title_el)

		if (extendedProps.days && extendedProps.days.length === 0) {
			let no_material_icon_el = document.createElement('div')
			no_material_icon_el.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" viewBox="0 0 36 36" class="fill-current w-4"><path d="M4.52 31.866H1.536c-.688 0-1.246.557-1.246 1.245v1.644C.29 35.444.847 36 1.534 36h32.35c.688 0 1.246-.557 1.246-1.246V33.11c0-.687-.558-1.244-1.245-1.244h-2.803l-3.463-9.252H7.98l-3.46 9.252zM19.607 1.206S19.377 0 17.802 0c-1.578 0-1.826 1.25-1.826 1.25l-3.023 8.08h9.695l-3.04-8.124zM11.61 12.923l-2.284 6.1h16.95l-2.284-6.1"></path></svg>'
			no_material_icon_el.style.color = '#ffe100'
			wrapper.appendChild(no_material_icon_el)
		}
		wrapper.appendChild(alert_el)
		wrapper.appendChild(time_el)
		wrapper.appendChild(title_el)
	} else if (extendedProps.type === 'trial_option') {
		let title_el = document.createElement('div')
		title_el.innerText = ' Option'
		let time_el = genTimeEl(arg)
		wrapper.appendChild(time_el)
		wrapper.appendChild(title_el)
	} else if (extendedProps.type === 'trial_option_temp') {
		let title_el = document.createElement('div')
		title_el.innerText = '[tbc] opt'
		let time_el = genTimeEl(arg)
		wrapper.appendChild(time_el)
		wrapper.appendChild(title_el)
	} else if (extendedProps.type === 'edit_temp') {
		let title_el = document.createElement('div')
		title_el.innerText = 'Edit'
		let time_el = genTimeEl(arg)
		wrapper.appendChild(time_el)
		wrapper.appendChild(title_el)
	} else if (extendedProps.type === 'reserved') {
		let title_el = document.createElement('div')
		title_el.innerText = getStudentTitle(extendedProps)
		let time_el = genTimeEl(arg)
		wrapper.appendChild(time_el)
		wrapper.appendChild(title_el)
	} else if (extendedProps.type === 'ff_reserved') {
		let title_el = document.createElement('div')
		title_el.innerText = getStudentTitle(extendedProps) || 'Option FF'
		let time_el = genTimeEl(arg)
		wrapper.appendChild(time_el)
		wrapper.appendChild(title_el)
	} else if (extendedProps.type === 'leave') {
		let title_el = document.createElement('div')
		title_el.innerText = 'Leave'
		let time_el = genTimeEl(arg)
		wrapper.appendChild(time_el)
		wrapper.appendChild(title_el)
	}
	return {
		domNodes: [wrapper]
	}
}