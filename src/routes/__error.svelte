<script context="module">
	/** @type {import('@sveltejs/kit').ErrorLoad} */
	export function load({ error, status }) {
		return {
			props: {
				error_message: error.message,
				status
			}
		};
	}
</script>

<script>
	export let error_message;
	export let status;
	import {sentry} from "$lib/sentry";

	if (error_message.includes('Failed to fetch dynamically imported module')) {
		window.location.reload()
		sentry.log('Trigger a full refresh from "Failed to fetch dynamically imported module"')
	} else {
		sentry.log(error_message)
	}
</script>

<div class="container text-center py-12">
	<p class="text-h1 mb-4">{status}</p>
	<h1 class="text-t2 mb-8">{error_message}</h1>
</div>