<script>
	import {student_store} from "../../store/student-store";
	import SelectionBox from '../ui-elements/selection-box.svelte'
	export let selected_value
	export let with_ticket_only = false
	$: filtered_options = with_ticket_only ? $student_store.filter(s => s.r_t_amt > 0) : $student_store
</script>

<SelectionBox {selected_value}
              options={filtered_options}
              on:input
              label_key="student_nickname"
              label_key_2="level"
              subtitle_key="student_username"
              value_key="student_id"
              placeholder="Select student">
</SelectionBox>

