import {readable, get} from "svelte/store";
export const createLevelMapper = () => {
	let store = readable({
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
	const getFullName = (short_code) => {
		return get(store)[short_code] || 'No full name'
	}
	return {
		subscribe: store.subscribe,
		getFullName
	}
}
export const level_mapper = createLevelMapper()