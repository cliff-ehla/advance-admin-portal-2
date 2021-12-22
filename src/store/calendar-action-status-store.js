import {writable} from "svelte/store";
import dayjs from "dayjs";

function createCalendarStore () {
	const _store = writable({
		status: undefined,
		student_id: undefined,
		teacher_id: undefined,
		voucher_id: undefined
	})
	const createTrial = ({student_id, teacher_id, voucher_id}) => {
		_store.update(v => {
			return {
				...v,
				student_id,
				teacher_id,
				voucher_id,
				status: 'create_trial'
			}
		})
	}
	const createCourse = ({start_hh_mm, end_hh_mm, student_id, teacher_id, voucher_id}) => {
		_store.update(v => {
			return {
				...v,
				student_id,
				teacher_id,
				voucher_id,
				status: 'create_course'
			}
		})
	}
	const createOption = () => {

	}
	const editTime = () => {

	}
	const clear = () => {
		_store.set({
			status: undefined,
			student_id: undefined,
			teacher_id: undefined,
			voucher_id: undefined
		})
	}
	return {
		subscribe: _store.subscribe,
		createTrial,
		createCourse,
		createOption,
		editTime,
		clear
	}
}
export const calendar_store = createCalendarStore()

export const action_status = writable('') // 'create_option' 'create_course' 'edit_time' 'create_trial' 'create_big_class' or ''
export const course_start_hh_mm = writable('12:00')
export const course_end_hh_mm = writable('12:30')
export const trial_lesson_retry_student_id = writable('')
export const editing_option = writable({})
export const edit_lesson_tbc_to_date = writable({})
export const course_lesson_tbc_selection = (() => {
	const store = new writable([])
	const add = ({start_date, end_date, teacher_id}) => {
		store.update(v => {
			return [
				{start_date, end_date, teacher_id},
				...v
			]
		})
	}
	const remove = (start) => {
		store.update(v => {
			return v.filter(slot => !dayjs(slot.start).isSame(dayjs(start), 'date'))
		})
	}
	const reset = () => {
		store.set([])
	}
	return {
		subscribe: store.subscribe,
		set: store.set,
		add,
		remove,
		reset
	}
})()