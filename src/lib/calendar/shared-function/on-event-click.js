import ZoomDetailPopup from "../../zoom/zoom-detail-dialog.svelte";
import ZoomLessonMenu from "../zoom-lesson-menu.svelte";
import {genBookedEventFromZoom, genTempEditEvent} from "../phase-to-events";
import dayjs from "dayjs";
import {calendar_store, action_status, course_lesson_tbc_selection, edit_lesson_tbc_to_date} from "../../../store/calendar-action-status-store";
import {get} from 'svelte/store'
import {syncTempEvents} from "./sync-temp-events";
import FineTunePopup from "../time-fine-tune-popup.svelte";
import DeleteMenu from "../delete-menu.svelte";
import MaterialSelectionDialog from '../../material/material-selection-dialog.svelte'
import {removeMaterialFromZoom} from "../../../api/zoom-api";
import {deleteLeaveTime} from "../../../api/tutor-api";
import {genTempSelectEvent} from "../phase-to-events";

export const onEventClick = ({event, el}, openPopper, openModal, month_calendar, day_calendar, tutor_id, onChangeDate) => {
	let state = get(calendar_store).status || get(action_status)
	let props = event.extendedProps
	let event_type = event.extendedProps.type
	if ((state === 'create_course' || state === 'create_option') && event_type === 'trial_option_temp') {
		// remove trial option
		event.remove()
		// sync event for tutor-month-calendar.svelte
		if (day_calendar) {
			syncTempEvents(month_calendar, day_calendar)
		}
		course_lesson_tbc_selection.remove(event.start)
	} else if (event_type === 'edit_temp') {
		let _start_time = dayjs(event.start).format('HH:mm')
		let _end_time = dayjs(event.end).format('HH:mm')
		openPopper(el, FineTunePopup, {
			start_time: _start_time,
			end_time: _end_time,
			onConfirm: ({start_hh_mm, end_hh_mm}) => {
				const yyyy_mm_ss = dayjs(event.start).format('YYYY-MM-DD')
				const start_date = `${yyyy_mm_ss} ${start_hh_mm}:00`
				const end_date = `${yyyy_mm_ss} ${end_hh_mm}:00`
				edit_lesson_tbc_to_date.update(v => {
					return {
						...v,
						...{
							to_start_date: dayjs(start_date),
							to_end_date: dayjs(end_date)
						}
					}
				})
				let calendars = [month_calendar, day_calendar]
				calendars.forEach(calendar => {
					calendar.getEvents().forEach(event => {
						if (event.extendedProps.type === 'edit_temp') {
							event.remove()
						}
					})
					calendar.addEventSource([genTempEditEvent({
						start: start_date,
						end: end_date,
						title: event.title
					})])
				})
			}
		}, {
			placement: 'right',
			persistent_content: true
		})
	} else if (state === '' && event_type === 'book') {
		openPopper(el, ZoomLessonMenu, {
			selected: event.start,
			days: event.extendedProps.days || [],
			zoom: event.extendedProps,
			onAddMaterial: (category) => {
				openModal(MaterialSelectionDialog, {
					zoom: event.extendedProps,
					category,
					onAddMaterialSuccess: ({item_id, item_title, day_id}) => {
						event.remove()
						setTimeout(() => {
							let new_zoom = props
							if (!new_zoom.days) {
								new_zoom.days = []
							}
							new_zoom.days.push({
								item_id,
								day_id,
								title: item_title
							})
							let new_event = genBookedEventFromZoom(new_zoom)
							month_calendar.addEventSource([new_event])
						}, 1000)
					}
				}, {
					styleWindow: {
						width: '680px',
						borderRadius: '0.5em'
					},
				})
			},
			onRemoveMaterial: async ({day_ids}) => {
				await removeMaterialFromZoom({
					wrapper_id: event.extendedProps.zoom_id,
					day_ids
				})
				event.remove()
				setTimeout(() => {
					let new_zoom = JSON.parse(JSON.stringify(props))
					new_zoom.days = new_zoom.days.filter(d => {
						day_ids.includes(d.day_id)
					})
					let new_event = genBookedEventFromZoom(new_zoom)
					month_calendar.addEventSource([new_event])
				}, 500)
			},
			onEdit: () => {
				openModal(ZoomDetailPopup, {
					zoom: event.extendedProps,
					onConfirm: new_zoom => {
						event.remove()
						setTimeout(() => {
							let event = genBookedEventFromZoom(new_zoom)
							month_calendar.addEventSource([event])
						}, 300)
					},
					onDelete: () => {
						event.remove()
					}
				}, {
					closeOnOuterClick: false
				})
			},
			onChangeDate: (e, type) => {
				let start_hh_mm_ss = dayjs(event.start).format('HH:mm:ss')
				let end_hh_mm_ss = dayjs(event.end).format('HH:mm:ss')
				let date = dayjs(e.detail).format('YYYY-MM-DD')
				let start_date = date + ' ' + start_hh_mm_ss
				let end_date = date + ' ' + end_hh_mm_ss

				let z = event.extendedProps
				let duration = dayjs(event.end).diff(dayjs(event.start), 'minute')

				edit_lesson_tbc_to_date.set({
					event_title: z.students.map(s => s.nickname).join(', '),
					wrapper_id: z.zoom_id,
					tutor_group_id: z.tutor_group_id,
					duration,
					teacher_id: tutor_id,
					title: z.title,
					to_start_date: start_date,
					to_end_date: end_date,
					from_start_date: dayjs(event.start).format('YYYY-MM-DD HH:mm:ss'),
					from_end_date: dayjs(event.end).format('YYYY-MM-DD HH:mm:ss'),
				})
				const tbc_event = genTempSelectEvent({
					start: start_date,
					end: end_date
				})
				action_status.set(type)
				month_calendar.changeView('dayGridMonth', e.detail)
				day_calendar.changeView('timeGridOneDay', e.detail)
				let calendars = [day_calendar, month_calendar]
				calendars.forEach(c => {
					c.addEvent(tbc_event, 'tbc')
				})
				onChangeDate(e.detail)
			}
		}, {
			placement: 'right'
		})
	} else if (event_type === 'leave') {
		let id = event.extendedProps.id
		openPopper(el, DeleteMenu, {
			onDelete: async () => {
				await deleteLeaveTime({id})
				event.remove()
				syncTempEvents(month_calendar, day_calendar, 'leave')
			}
		})
	}
}