import {writable, get, derived, readable} from "svelte/store";
import {big_class_mapper} from "$lib/store/big-class-mapper.js";
import dayjs from "dayjs";
import {http} from "$lib/http.js";
import {tutor_store} from "../../store/tutor-store.js";

const create_big_class_store = () => {
	const store = writable([])
	const month_log = writable([])
	const callIfNoCache = async (fetch, {month}) => {
		if (get(month_log).includes(month)) return console.log(`Use cache: ${month} is already fetched`)
		month_log.update(arr => [...arr, month])
		const key = month + '-01'
		let {data, success, debug} = await http.post(fetch,'/courseApi/list_registrable_classroom_for_admin', {
			start_date: dayjs(key).startOf('month').format('YYYY-MM-DD HH:mm:ss'),
			end_date: dayjs(key).endOf('month').format('YYYY-MM-DD HH:mm:ss'),
		})
		if (success) {
			data = data.filter(d => !!d.start_date)
			store.update(v => {
				return [...v, ...data]
			})
			return data
		} else {
			console.log(debug.error_message)
		}
	}
	const clear = () => {
		store.set([])
		month_log.set([])
	}
	return {
		subscribe: store.subscribe,
		set: store.set,
		callIfNoCache,
		clear
	}
}

export const big_class_store = create_big_class_store()

const createBigClassEventStore = () => {
	const selected_levels = writable([])
	const selected_codes = writable([])
	const selected_tutors = writable([])
	const exclude_is_full = writable(false)
	const selected_zoom_ids = writable([])

	const addSelection = (zoom_id) => {
		selected_zoom_ids.update(v => {
			return [...v, zoom_id]
		})
	}
	const removeSelection = (zoom_id) => {
		selected_zoom_ids.update(v => {
			return v.filter(v => v !== zoom_id)
		})
	}
	const clearAllSelection = () => {
		selected_zoom_ids.set([])
	}

	const toggleIsFull = () => {
		exclude_is_full.update(v => !v)
	}
	const toggleLevelFilter = (lv) => {
		selected_levels.update(v => {
			if (v.includes(lv)) {
				v.splice(v.indexOf(lv),1)
				return v
			} else {
				v.push(lv)
				return v
			}
		})
	}
	const toggleCodeFilter = (code) => {
		selected_codes.update(v => {
			if (v.includes(code)) {
				v.splice(v.indexOf(code),1)
				return v
			} else {
				v.push(code)
				return v
			}
		})
	}
	const toggleTutorFilter = (code) => {
		selected_tutors.update(v => {
			if (v.includes(code)) {
				v.splice(v.indexOf(code),1)
				return v
			} else {
				v.push(code)
				return v
			}
		})
	}
	const clearLevelFilters = () => {
		selected_levels.set([])
	}
	const clearCodeFilters = () => {
		selected_codes.set([])
	}
	const big_class_events = derived([big_class_store, selected_zoom_ids], ([$big_class_store, $selected_zoom_ids]) => {
		return $big_class_store.map(e => {
			const extendedProps = {
				selected: $selected_zoom_ids.includes(e.zoom_id),
				type: 'classroom',
				ticket: e.ticket,
				reg_user_cnt: e.reg_user_cnt,
				student_size: e.student_size,
				is_full: e.reg_user_cnt === e.student_size,
				cat: e.sub_cat_alter,
				tutor_id: e.tutor_id,
				tutor_group_id: e.tutor_group_id,
				tutor_name: e.tutor_name,
				start_date: e.start_date,
				zoom_id: e.zoom_id,
				no_material: e.no_material,
				level: e.rc_level,
				levels: big_class_mapper.getLevels(e.rc_level),
				material: e.name,
				code: e.description_code_short_id,
				sub_cat_alter: e.sub_cat_alter || 'NA',
				duration: e.duration || 'NA',
				is_native_teacher: e.is_native_teacher,
				is_always_open: e.is_always_open
			}
			return {
				start: e.start_date,
				extendedProps
			}
		})
	})
	const _store = derived([big_class_events, selected_levels, selected_codes, selected_tutors, exclude_is_full, selected_zoom_ids],
			([$events, $selected_levels, $selected_codes, $selected_tutors, $exclude_is_full, $selected_zoom_ids]) => {
		const code_filters = big_class_mapper.all_codes.map(c => ({
			key: c,
			count: 0,
			selected: $selected_codes.includes(c)
		}))
		const level_filters = big_class_mapper.all_levels.map(c => ({
			key: c,
			count: 0,
			selected: $selected_levels.includes(c)
		}))
		const tutor_filters = get(tutor_store).map(t => ({
			key: t.user_id,
			label: t.nickname,
			count: 0,
			selected: $selected_tutors.includes(t)
		}))
		if ($selected_levels.length) {
			$events = $events.filter(e => {
				return e.extendedProps.levels.some(lv => {
					return $selected_levels.includes(lv)
				})
			})
		}
		if ($selected_codes.length) {
			$events = $events.filter(e => {
				return $selected_codes.includes(e.extendedProps.code)
			})
		}
		if ($selected_tutors.length) {
			$events = $events.filter(e => {
				return $selected_tutors.includes(e.extendedProps.tutor_id)
			})
		}
		if ($exclude_is_full) {
			$events = $events.filter(e => {
				return !e.extendedProps.is_full
			})
		}
		$events.forEach(e => {
			let {code, levels, tutor_id} = e.extendedProps
			let obj = code_filters.find(f => f.key === code)
			if (obj) obj.count++
			let obj2 = tutor_filters.find(f => f.key === tutor_id)
			if (obj2) obj2.count++
			levels.forEach(lv => {
				let obj = level_filters.find(f => f.key === lv)
				if (obj) obj.count++
			})
		})
		const selected_events = $events.filter(e => $selected_zoom_ids.includes(e.extendedProps.zoom_id))
		return {
			events: $events,
			selected_events,
			level_filter_off:  $selected_levels.length === 0,
			code_filter_off: $selected_codes.length === 0,
			code_filters,
			level_filters,
			tutor_filters,
			exclude_is_full: $exclude_is_full
		}
	})
	return {
		subscribe: _store.subscribe,
		toggleLevelFilter,
		toggleCodeFilter,
		toggleTutorFilter,
		clearLevelFilters,
		clearCodeFilters,
		toggleIsFull,
		addSelection,
		removeSelection,
		clearAllSelection
	}
}

export const big_class_events = createBigClassEventStore()

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
			return dayjs(classroom.start_date).isBefore(dayjs().add(get(time_range), 'day')) && dayjs(classroom.start_date).isAfter(dayjs())
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
				if (!obj) return
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
				} else if (reg_seat !== vacant_seat) {
					obj.enough_ppl_lesson_count ++
				} else {
					obj.full_house_lesson_count ++
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