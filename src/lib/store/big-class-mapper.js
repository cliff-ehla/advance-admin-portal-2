import {readable, get} from "svelte/store";
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
	let level_map_store = readable({
		"6yro-or-below": ['k1', 'k2', 'k3'],
		"7yro-to-9yro": ['p1', 'p2', 'p3'],
		"ks1-of-primary": ['k1', 'k2'],
		"ks2-of-primary": ['k2', 'k3'],
		"p1-p6": ['p1', 'p2', 'p3', 'p4', 'p5', 'p6'],
		"p1-p2": ['p1', 'p2'],
		"p2-p3": ['p2', 'p3'],
		"p3-p4": ['p3', 'p4'],
		"p4-p5": ['p4', 'p5'],
		"p5-p6": ['p5', 'p6'],
		"p4-to-p5-exam-prep": ['p4', 'p5'],
		"p4-to-p6-exam-prep": ['p4', 'p5', 'p6'],
	})
	const all_levels = ['k1', 'k2', 'k3', 'p1', 'p2', 'p3', 'p4', 'p5', 'p6', 'na']
	const getCourseCategoryFullName = (short_code) => {
		return get(course_code_store)[short_code] || 'No full name'
	}
	const getLevels = (rc_level) => {
		return get(level_map_store)[rc_level] || ['na']
	}
	return {
		getCourseCategoryFullName,
		getLevels,
		all_levels
	}
}
export const big_class_mapper = createLevelMapper()