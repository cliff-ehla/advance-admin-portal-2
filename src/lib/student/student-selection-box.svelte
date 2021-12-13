<script>
	import {student_store} from "../../store/student-store";
	import SelectionBox from '../ui-elements/selection-box.svelte'

	export let selected_value
</script>

<div class="flex justify-between items-center mb-2">
	<p class="text-sm text-gray-400">Student ({selected_value})</p>
</div>

<SelectionBox {selected_value}
              options={$student_store}
              on:input
              label_key="student_nickname"
              label_key_2="level"
              subtitle_key="student_username"
              value_key="user_id"
              placeholder="Select student">

</SelectionBox>

