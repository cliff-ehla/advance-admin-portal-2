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
	return {
		subscribe: store.subscribe,
		set: store.set,
		getLevelStat
	}
}

export const big_class_store = create_big_class_store()