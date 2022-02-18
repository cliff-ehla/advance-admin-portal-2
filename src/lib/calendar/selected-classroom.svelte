<script>
	import {big_class_events} from "$lib/store/big-class-store.js";
	import dayjs from "dayjs";
	import utc from "dayjs/plugin/utc.js";
	dayjs.extend(utc)
	import CopyText from '$lib/option/copy-message-textbox.svelte'
	import {onMount} from "svelte";

	let copy_text = ''

	onMount(() => {
		dayjs.locale('zh-hk')
		$big_class_events.selected_events.forEach(e => {
			console.log('cliff: ', e)
			copy_text += e.extendedProps.student_size > 4 ? '大班課' : '小組課'
			copy_text += dayjs.utc(e.start).local().format('LLL')
			copy_text += '\n'
			copy_text += '老師：' + e.extendedProps.tutor_name
			copy_text += '\n'
			copy_text += e.extendedProps.sub_cat_alter
			copy_text += ` (${e.extendedProps.is_native_teacher ? '外籍老師' : '雙語課堂'} ${e.extendedProps.duration}分鐘)`
			copy_text += '\n'
			copy_text += '----------'
			copy_text += '\n'
		})
		return () => {
			dayjs.locale('en')
		}
	})
</script>

<h1 class="text-xl mb-4 font-light">課程推介</h1>
<CopyText msg={copy_text}/>