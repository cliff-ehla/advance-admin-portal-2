import {writable, get} from "svelte/store";
import {big_class_mapper} from "$lib/store/big-class-mapper.js";

const create_big_class_store = () => {
	const store = writable([])
	const getLevelStat = () => {
		const result = big_class_mapper.all_levels.map(lv => ({
			level: lv,
			lesson_count: 0,
			native_lesson_count: 0,
			bilingual_lesson_count: 0,
			full_house_lesson_count: 0,
			enough_ppl_lesson_count: 0,
			only_one_ppl_lesson_count: 0,
			empty_lesson_count: 0,
			reg_seat: 0,
			vacant_seat: 0
		}))
		get(store).forEach(classroom => {
			// console.log(classroom)
			const levels = big_class_mapper.getLevels(classroom.rc_level)
			levels.forEach(lv => {
				const obj = result.find(i => i.level === lv)
				obj.lesson_count++
				if (classroom.is_native_teacher) {
					obj.native_lesson_count ++
				} else {
					obj.bilingual_lesson_count ++
				}
				const reg_seat = Number(classroom.reg_user_cnt)
				const vacant_seat = Math.min(classroom.student_size, 10) - reg_seat
				if (reg_seat === 0) {
					obj.empty_lesson_count ++
				} else if (reg_seat === 1) {
					obj.only_one_ppl_lesson_count ++
				} else if (reg_seat === vacant_seat) {
					obj.full_house_lesson_count ++
				} else {
					obj.enough_ppl_lesson_count ++
				}
				obj.reg_seat = obj.reg_seat + reg_seat
				obj.vacant_seat = obj.vacant_seat + vacant_seat
			})
		})
		return result
	}

	const getStatusSummary = () => {
		const result = [
			{
				label: '無人報',
				lesson_count: 0
			},
			{
				label: '得一個人報',
				lesson_count: 0
			},
			{
				label: '2-3人',
				lesson_count: 0
			},
			{
				label: '滿員',
				lesson_count: 0
			}
		]
		get(store).forEach(classroom => {
			const reg_seat = Number(classroom.reg_user_cnt)
			const vacant_seat = Math.min(classroom.student_size, 10) - reg_seat
			if (reg_seat === 0) {
				result[0].lesson_count ++
			} else if (reg_seat === 1) {
				result[1].lesson_count ++
			} else if (reg_seat === vacant_seat) {
				result[3].lesson_count++
			} else {
				result[2].lesson_count++
			}
		})
		return result
	}

	const getBookingStatus = () => {
		let vacant_seat = 0
		let reg_seat = 0
		get(store).forEach(classroom => {
			const _reg_seat = Number(classroom.reg_user_cnt)
			const _vacant_seat = Math.min(classroom.student_size, 20) - _reg_seat
			vacant_seat += _vacant_seat
			reg_seat += _reg_seat
		})
		const total_seat = vacant_seat + reg_seat
		return {
			total_seat,
			vacant_seat,
			reg_seat,
			vacancy_date: Math.round(vacant_seat / total_seat * 100)
		}
	}

	return {
		subscribe: store.subscribe,
		set: store.set,
		getLevelStat,
		getStatusSummary,
		getBookingStatus
	}
}

export const big_class_store = create_big_class_store()