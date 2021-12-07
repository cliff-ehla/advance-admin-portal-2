<script context="module">
	import dayjs from "dayjs";

	export const load = async () => {
		return {
			status: 302,
			redirect: `/voucher/${dayjs().format('YYYY-MM')}`
		}
	}
</script>