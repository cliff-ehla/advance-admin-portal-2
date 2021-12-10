<script context="module">
	import {http, onFail} from "$lib/http";
	import {tutor_store} from "../store/tutor-store";
	import {student_store} from "../store/student-store";

	export const load = async ({fetch}) => {
		const {data, success, debug} = await http.get(fetch, '/organizationApi/tutor_list')
		if (!success) return onFail(debug)
		tutor_store.set(data)

		const res = await http.get(fetch, '/adminApi/list_students_with_ticket_info')
		if (!res.success) return onFail(res.debug)
		student_store.set(res.data)

		return {
			props: {
				tutor_list: data,
				student_list: res.data
			}
		}
	}
</script>

<script>
	import '../styles/tailwind-output.css';
	import Modal from '../lib/app-shelf/modal.svelte'
	import Popper from '../lib/app-shelf/popper.svelte'
	import Notification from '../lib/app-shelf/notification.svelte'
	import LoadingBar from '$lib/ui-elements/indeterminate-loading-bar.svelte'
	import Toast from '../lib/app-shelf/toast.svelte'
	import Dialog from '../lib/app-shelf/dialog.svelte'
	import TopBar from '../lib/app-shelf/top-bar.svelte'
	import {onMount} from "svelte";
	import {getUserInfo} from "../api/user-api";
	import {sentry} from "$lib/sentry";
	import {navigating} from "$app/stores";

	export let segment;

	onMount(() => {
		sentry.init()
		getUserInfo()
	})
</script>

{#if $navigating}
	<div class="fixed inset-x-0 top-0 z-50">
		<LoadingBar/>
	</div>
{/if}
<Toast/>
<Dialog/>
<Notification>
	<Popper>
		<Modal>
			<TopBar {segment}/>
			<slot></slot>
		</Modal>
	</Popper>
</Notification>