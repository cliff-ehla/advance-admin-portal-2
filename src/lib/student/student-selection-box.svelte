<script>
	import {student_store} from "../../store/student-store";
	import SelectionBox from '../ui-elements/selection-box.svelte'
	import Icon from '../ui-elements/icon.svelte'
	import {fetchStudentList} from "../../store/org-api";

	export let selected_value
</script>

<div class="flex justify-between items-center mb-2">
	<p class="text-sm text-gray-400">Student ({selected_value})</p>
	<button on:click={fetchStudentList}>
		<Icon name="refresh" className="w-4"/>
	</button>
</div>

<SelectionBox {selected_value}
              options={$student_store}
              on:input
              label_key="nickname"
              label_key_2="level"
              subtitle_key="username"
              value_key="user_id"
              placeholder="Select student">

</SelectionBox>

