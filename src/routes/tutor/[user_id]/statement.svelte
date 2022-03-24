<script context="module">
	import {http, onFail} from "$lib/http";

	export const load = async ({page, fetch}) => {
		const {data, success, debug} = await http.post(fetch, '/zoomApi/list_tutor_salary', {
			teacher_id: page.params.user_id
		})
		if (!success) return onFail(debug)
		return {
			props: {
				statements: data
			}
		}
	}
</script>

<script>
	import TutorStatement from '$lib/statement/index.svelte'
	export let statements = []
	let loading
</script>

<TutorStatement {statements}/>