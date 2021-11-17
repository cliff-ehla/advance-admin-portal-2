<script>
	import dayjs from "dayjs";
	import {goto} from '$app/navigation'
	import {page} from '$app/stores'
	import MultipleTutorCalendar from '../../components/calendar/multiple-tutor-calendar.svelte'
	import Datepicker from '../../components/ui-elements/date-picker/index.svelte'
	import Icon from '../../components/ui-elements/icon.svelte'
	$: YYYY_MM_DD = $page.params.YYYY_MM_DD

	const onDateChange = (e) => {
		goto(`zoom/${dayjs(e.detail).format('YYYY-MM-DD')}`)
	}

	const onPrev = () => {
		let prev_date = dayjs(YYYY_MM_DD).subtract(1,'day').format('YYYY-MM-DD')
		goto(`zoom/${prev_date}`)
	}

	const onNext = () => {
		let next_date = dayjs(YYYY_MM_DD).add(1,'day').format('YYYY-MM-DD')
		goto(`zoom/${next_date}`)
	}
</script>

<div class="flex items-center justify-between px-8 h-16 border-b border-gray-300">
	<button on:click={onPrev} class="transform rotate-180 w-12 h-12 hover:bg-blue-500 hover:text-white rounded-full bg-gray-100 border border-gray-300 flex items-center justify-center">
		<Icon className="w-4" name="right"/>
	</button>

	<Datepicker selected={dayjs(YYYY_MM_DD).toDate()} on:datechange={onDateChange}/>

	<button on:click={onNext} class="w-12 h-12 hover:bg-blue-500 hover:text-white rounded-full bg-gray-100 border border-gray-300 flex items-center justify-center">
		<Icon className="w-4" name="right"/>
	</button>
</div>
<MultipleTutorCalendar {YYYY_MM_DD}/>