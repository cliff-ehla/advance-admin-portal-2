<script context="module">
	import {http, onFail} from "$lib/http";
	import dayjs from "dayjs";

	export const load = async ({page, fetch}) => {
		let start_date = page.query.get('start_date')
		let end_date = page.query.get('end_date')
		if (!(start_date && end_date)) {
			start_date = dayjs().subtract(1, 'week').format('YYYY-MM-DD')
			end_date = dayjs().format('YYYY-MM-DD')
			return {
				status: 302,
				redirect: `/students/analytic?start_date=${start_date}&end_date=${end_date}`
			}
		}
		const {data, success, debug} = await http.post(fetch, '/adminApi/list_paid_user_level_distribution', {
			start_date: start_date + ' 00:00:00',
			end_date: end_date + ' 00:00:00'
		})
		if (!success) return onFail(debug)
		return {
			props: {
				list: data
			}
		}
	}
</script>

<script>
	import {goto} from "$app/navigation";
	export let list
	import {big_class_mapper} from "$lib/store/big-class-mapper.js";
	import {page} from "$app/stores";
	import {capitalize} from "$lib/helper/capitalize.js";
	import DatePicker from "$lib/ui-elements/date-picker/index.svelte";

	$: start_date = $page.query.get('start_date')
	$: end_date = $page.query.get('end_date')
	$: diff = dayjs(end_date).diff(dayjs(start_date), 'day')

	let all_levels

	const gen_base_obj = () => {
		return big_class_mapper.all_levels.map(lv => ({
			level: capitalize(lv),
			users: []
		}))
	}

	$: {
		if (start_date) {
			all_levels = gen_base_obj()
			list.forEach(user => {
				let obj = all_levels.find(lv => lv.level === capitalize(user.levels))
				if (obj) obj.users.push(user)
			})
		}
	}

	const initChart = (node, _all_level) => {
		const chart = new Chart(node, {
			type: 'bar',
			data: {
				labels: _all_level.map(d => d.level),
				datasets: [
					{
						data: _all_level.map(d => d.users.length),
						backgroundColor: 'rgba(54, 162, 235, 0.6)',
						label: '人數'
					}
				]
			}
		})
		return {
			update: _all_level => {
				chart.data.datasets = [
					{
						data: _all_level.map(d => d.users.length),
						backgroundColor: 'rgba(54, 162, 235, 0.6)',
						label: '人數'
					}
				]
				chart.update()
			}
		}
	}
	
	const onStartDateChange = ({detail}) => {
		goto(`/students/analytic?start_date=${dayjs(detail).format('YYYY-MM-DD')}&end_date=${end_date}`)
	}

	const onEndDateChange = ({detail}) => {
		goto(`/students/analytic?start_date=${start_date}&end_date=${dayjs(detail).format('YYYY-MM-DD')}`)
	}
</script>

<div class="p-4">
	<div class="mb-4 mx-1">
		<h1 class="font-bold text-xl">
			{dayjs(start_date).format('DD MMM')} - {dayjs(end_date).format('DD MMM')} 新增用戶分佈
		</h1>
		<p>{diff}日，新增共{list.length}人</p>
	</div>
	<div class="mb-2 flex">
		<div>
			<p>From:</p>
			<DatePicker selected={dayjs(start_date).toDate()} on:datechange={onStartDateChange}/>
		</div>
		<div class="ml-4">
			<p>To:</p>
			<DatePicker selected={dayjs(end_date).toDate()} on:datechange={onEndDateChange}/>
		</div>
	</div>
	{#if all_levels}
		<div class="max-w-screen-lg">
			<canvas use:initChart={all_levels}></canvas>
		</div>
		<div class="my-4 grid-cols-5 gap-8 grid">
			{#each all_levels as level}
				<div class="py-2">
					<p>{level.level} ({level.users.length})</p>
					{#each level.users as user}
						<div class="my-2">
							<p class="text-sm text-gray-500 leading-tight">{dayjs(user.v_date).format('DD MMM')}</p>
							<div class="leading-tight flex justify-between">{user.phone} <span class="text-blue-500">${user.lesson_fee}</span></div>
						</div>
					{/each}
				</div>
			{/each}
		</div>
	{/if}
</div>