import {writable, get} from "svelte/store";
import {big_class_mapper} from "$lib/store/big-class-mapper.js";

const create_big_class_store = () => {
	const store = writable([])
	const getLevelStat = () => {
		const result = big_class_mapper.all_levels.map(lv => ({
			level: lv,
			lesson_count: 0,
			native_lesson_count: 0,
			bilingual_lesson_count: 0
		}))
		get(store).forEach(classroom => {
			console.log(classroom)
			const levels = big_class_mapper.getLevels(classroom.rc_level)
			levels.forEach(lv => {
				const obj = result.find(i => i.level === lv)
				obj.lesson_count++
				if (classroom.is_native_teacher) {
					obj.native_lesson_count ++
				} else {
					obj.bilingual_lesson_count ++
				}
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