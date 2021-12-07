<script>
	import '../styles/tailwind-output.css';
	import Modal from '../lib/app-shelf/modal.svelte'
	import Popper from '../lib/app-shelf/popper.svelte'
	import Notification from '../lib/app-shelf/notification.svelte'
	import LoadingBar from '$lib/ui-elements/indeterminate-loading-bar.svelte'
	import Toast from '../lib/app-shelf/toast.svelte'
	import TopBar from '../lib/app-shelf/top-bar.svelte'
	import {onMount} from "svelte";
	import {getUserInfo} from "../api/user-api";
	import {fetchTeacherList} from "../store/org-api";
	import {fetchStudentList} from "../store/org-api";
	import {sentry} from "$lib/sentry";
	import {navigating} from "$app/stores";

	export let segment;

	onMount(() => {
		sentry.init()
		getUserInfo()
		fetchTeacherList()
		fetchStudentList()
	})
</script>

{#if $navigating}
	<div class="fixed inset-x-0 top-0 z-50">
		<LoadingBar/>
	</div>
{/if}
<Toast/>
<Notification>
	<Popper>
		<Modal>
			<TopBar {segment}/>
			<slot></slot>
		</Modal>
	</Popper>
</Notification>