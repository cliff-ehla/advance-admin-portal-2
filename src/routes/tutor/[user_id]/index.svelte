<script context="module">
	import dayjs from "dayjs";
	export const load = ({page}) => {
		return {
			status: 302,
			redirect: `/tutor/${page.params.user_id}/${dayjs().format('YYYY-MM')}`
		}
	}
</script>