import {readable, get, writable} from "svelte/store";
import {notifications} from "$lib/store/notification.js";
import {http} from "$lib/http.js";

export const createLevelMapper = () => {
	let course_code_store = readable({
		GExam: "GrammarExamDriven",
		GUsage: "GrammarUsage",
		K23Int: "K23EnglishPrepP1Interview",
		RC: "ReadingComprehension",
		RS: "ReadingSpeaking",
		RoL: "ReadOutLoud",
		SSI: "SSInterview",
		SSIB: "SSInterviewBriefing",
		Story: "StoryReading",
		W: "WritingClass",
		WG: "WritingGradingApp",
		WGC: "WritingGradingCorrection"
	})
	const all_codes = Object.keys(get(course_code_store))
	let level_map_store = writable({})
	const all_levels = ['k1', 'k2', 'k3', 'p1', 'p2', 'p3', 'p4', 'p5', 'p6', 's1', 's2', 's3']
	const fetchRcLevelMapping = async (fetch) => {
		const {success, data, debug} = await http.get(fetch, '/courseApi/rc_level_list')
		if (!success) return {success, data, debug}
		let obj = {}
		data.forEach(lv => {
			obj[lv.rc_level] = lv.levels.map(_lv => _lv.level_en)
			level_map_store.set(obj)
		})
		return {success, data, debug}
	}
	const getCourseCategoryFullName = (short_code) => {
		return get(course_code_store)[short_code] || 'No full name'
	}
	const getLevels = (rc_level) => {
		const levels = get(level_map_store)[rc_level]
		if (levels) {
			return levels
		} else {
			notifications.alert('Cannot map this rc_level:' + rc_level, 400)
			return ['na']
		}
	}
	return {
		getCourseCategoryFullName,
		getLevels,
		all_levels,
		all_codes,
		fetchRcLevelMapping
	}
}
export const big_class_mapper = createLevelMapper()