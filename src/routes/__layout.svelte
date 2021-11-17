<script>
	import Modal from '../components/app-shelf/modal.svelte'
	import Popper from '../components/app-shelf/popper.svelte'
	import Notification from '../components/app-shelf/notification.svelte'
	import TopBar from '../components/app-shelf/top-bar.svelte'
	import {onMount} from "svelte";
	import {getUserInfo} from "../api/user-api";
	import {fetchTeacherList} from "../store/org-api";
	import {fetchStudentList} from "../store/org-api";
	import {sentry} from "$lib/sentry";

	export let segment;

	onMount(() => {
		sentry.init()
		getUserInfo()
		fetchTeacherList()
		fetchStudentList()
	})
</script>

<Notification>
	<Popper>
		<Modal>
			<TopBar {segment}/>
			<slot></slot>
		</Modal>
	</Popper>
</Notification>