import {derived} from "svelte/store";
import {student_store} from "../../store/student-store.js";

export const student_analytic = derived(student_store, $student_store => {
	const result = {
		total_students: 0,
		many_ticker_user_count: 0,
		few_ticker_user_count: 0,
		new_user_count: 0,
		new_users: [],
		few_ticker_user: [],
		many_ticker_user: []
	}

	$student_store.forEach(s => {
		if (s.tt_t_amt > 0 && !s.parent_username.includes('queenie')) {
			result.total_students++
			if (s.tt_t_amt <= 6) {
				result.new_user_count++
				result.new_users.push(s)
			} else if (s.r_t_amt  <= 6) {
				result.few_ticker_user_count++
				result.few_ticker_user.push(s)
			} else if (s.r_t_amt > 6) {
				result.many_ticker_user_count++
				result.many_ticker_user.push(s)
			}
		}
	})
	return result
})

// export const student_analytic = create_student_analytic()