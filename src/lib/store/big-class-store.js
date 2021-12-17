import {writable, get, derived, readable} from "svelte/store";
import {big_class_mapper} from "$lib/store/big-class-mapper.js";
import dayjs from "dayjs";

const create_big_class_store = () => {
	const store = writable([])
	return {
		subscribe: store.subscribe,
		set: store.set
	}
}

export const big_class_store = create_big_class_store()

const _time_range_options = [
	{
		key: 'week',
		label: '一星期',
		days: 7
	},
	{
		key: 'two-week',
		label: '兩星期',
		days: 14
	},
	{
		key: 'month',
		label: '一個月',
		days: 30
	},
	{
		key: 'two-month',
		label: '兩個月',
		days: 60
	}
]

const create_class_analytic = () => {
	const time_range = writable(7)
	const time_range_options = readable(_time_range_options)
	const filtered_classroom = derived([big_class_store, time_range], ([$big_class_store, $time_span]) => {
		return $big_class_store.filter(classroom => {
			return dayjs(classroom.start_date).isBefore(dayjs().add(get(time_range), 'day'))
		})
	})
	const seat_analytic = derived(filtered_classroom, $big_class_tore => {
		let vacant_seat = 0
		let reg_seat = 0
		$big_class_tore.forEach(classroom => {
			const _reg_seat = Number(classroom.reg_user_cnt)
			const _vacant_seat = Math.min(classroom.student_size, 20) - _reg_seat
			vacant_seat += _vacant_seat
			reg_seat += _reg_seat
		})
		const total_seat = vacant_seat + reg_seat
		return {
			total_count: total_seat,
			vacant_count: vacant_seat,
			reg_count: reg_seat,
			vacancy_rate: Math.round(vacant_seat / total_seat * 100)
		}
	})
	const lesson_analytic = derived(filtered_classroom, $filtered_classroom => {
		const labels = ['無人報', '得一個人報', '2-3人', '滿員']
		const result = labels.map(label => ({
			label,
			lesson_count: 0
		}))
		$filtered_classroom.forEach(classroom => {
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
		return {
			total_count: $filtered_classroom.length,
			chart: result
		}
	})
	const by_level_analytic = derived(filtered_classroom, ($filtered_classroom) => {
		const languages = ['Native', 'Bilangal']
		const status = ['無人報', '得一個人', '2-3人', '滿員']
		const vacancy = ['Vacant seat', 'Registered seat']
		const result = big_class_mapper.all_levels.map(lv => ({
			level: lv,
			lesson_count: 0,
			language: languages.map(label => ({
				label, count: 0
			})),
			status: status.map(label => ({
				label, count: 0
			})),
			vacancy: vacancy.map(label => ({
				label, count: 0
			})),
			native_lesson_count: 0,
			bilingual_lesson_count: 0,
			full_house_lesson_count: 0,
			enough_ppl_lesson_count: 0,
			only_one_ppl_lesson_count: 0,
			empty_lesson_count: 0,
			reg_seat: 0,
			vacant_seat: 0
		}))
		$filtered_classroom.forEach(classroom => {
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
					obj.status[0].count++
				} else if (reg_seat === 1) {
					obj.only_one_ppl_lesson_count ++
					obj.status[1].count++
				} else if (reg_seat !== vacant_seat) {
					obj.enough_ppl_lesson_count ++
					obj.status[2].count++
				} else {
					obj.full_house_lesson_count ++
					obj.status[3].count++
				}
				obj.reg_seat = obj.reg_seat + reg_seat
				obj.vacant_seat = obj.vacant_seat + vacant_seat
			})
		})
		return result
	})

	const store = derived([seat_analytic, lesson_analytic, by_level_analytic, time_range_options, time_range],
			([$seat_analytic, $lesson_analytic, $by_level_analytic, $time_range_options, $time_range]) => {
		const time_obj = $time_range_options.find(obj => obj.days === $time_range)
		return {
			seat: $seat_analytic,
			classroom: $lesson_analytic,
			by_level: $by_level_analytic,
			time_range_options: $time_range_options,
			time_range: $time_range,
			time_label: time_obj && time_obj.label
		}
	})
	const setRange = (range) => {
		time_range.set(range)
	}
	return {
		subscribe: store.subscribe,
		setRange
	}
}

export const classroom_analytic = create_class_analytic()