<script context="module">
	export let load = ({page}) => {
		return {
			status: 302,
			redirect: `/students/${page.params.student_id}/tutor-group`
		}
	}
</script>