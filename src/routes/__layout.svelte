<script context="module">
	import {http} from "$lib/http";
	import {tutor_store} from "../store/tutor-store";
	import {student_store} from "../store/student-store";
	import {user_info, authorized} from "$lib/store/user_info.js";
	import {get} from "svelte/store"

	import dayjs from "dayjs";
	import 'dayjs/locale/zh-hk.js';
	import updateLocale from 'dayjs/plugin/updateLocale.js'
	import localizedFormat from 'dayjs/plugin/localizedFormat.js'
	import {sentry} from "$lib/sentry.js";
	dayjs.extend(updateLocale)
	dayjs.extend(localizedFormat)
	dayjs.updateLocale('zh-hk', {
		formats: {
			LLL: 'M月D日（dddd）ah:mm',
			LLLL: 'YYYY年M月D日（dddd）ah:mm'
		},
		meridiem: (hour, minute, isLowercase) => {
			return hour > 12 ? '下午' : '上午'
		}
	})

	export const load = async ({fetch, session, page}) => {
		if (!get(authorized)) {
			user_info.set(session.user_info)
		} else {
			sentry.setUser({
				username: session.username,
				nickname: session.nickname
			})
		}
		const {data, success, debug} = await http.get(fetch, '/organizationApi/tutor_list')
		if (success) {
			data.sort((a,b) => {
				return a.nickname > b.nickname ? 1 : -1
			})
			tutor_store.set(data)
			await student_store.fetchData(fetch);
			return true
		} else {
			if (debug && debug.err_code === 401 && page.path !== '/logout' && page.path !== '/login') {
				return {
					status: 302,
					redirect: '/logout'
				}
			} else {
				return true
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
	import {navigating} from "$app/stores";
	import {page} from "$app/stores";

	onMount(() => {
		sentry.init()
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
	<Modal>
		<Popper>
			{#if $authorized && $page.path !== '/item'}
				<TopBar/>
			{/if}
			<slot></slot>
		</Popper>
	</Modal>
</Notification>