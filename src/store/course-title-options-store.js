import {readable} from "svelte/store";

export const course_title_options_store = readable([
	{
		value: 'Reading and Speaking Class',
		label: 'Reading and Speaking Class'
	},
	{
		value: 'Creative Writing Class',
		label: 'Creative Writing Class'
	},
	{
		value: 'Reading & Speaking, Reading Comprehension & Writing (P5/P6)',
		label: 'Reading & Speaking, Reading Comprehension & Writing (P5/P6)'
	}
])