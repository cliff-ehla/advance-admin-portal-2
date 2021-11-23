<script>
	import TutorGroupOfStudent from '../../../lib/tutor-group/tutor-group-of-student.svelte'
	import {page} from '$app/stores'
</script>

<TutorGroupOfStudent student_id={$page.params.student_id}/>