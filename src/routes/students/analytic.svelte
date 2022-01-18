<script context="module">
	import {http, onFail} from "$lib/http";
	import dayjs from "dayjs";

	export const load = async ({page, fetch}) => {
		const week_count = page.query.get('week_count') || 1
		let start_date = dayjs().subtract(week_count, 'week').format('YYYY-MM-DD HH:mm:ss')
		const {data, success, debug} = await http.post(fetch, '/adminApi/list_paid_user_level_distribution', {
			start_date,
			end_date: dayjs().format('YYYY-MM-DD HH:mm:ss')
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
	export let list
	import {big_class_mapper} from "$lib/store/big-class-mapper.js";
	import {page} from "$app/stores";
	import {capitalize} from "$lib/helper/capitalize.js";

	$: week_count = $page.query.get('week_count')

	let all_levels

	const gen_base_obj = () => {
		return big_class_mapper.all_levels.map(lv => ({
			level: capitalize(lv),
			users: []
		}))
	}

	$: {
		if (week_count) {
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
</script>

<div class="p-4">
	<h1 class="font-bold mb-4 mx-1 text-xl">
		最近{week_count}星期新增用戶分佈
	</h1>
	<div class="mb-2">
		{#each [1,2,3,4] as count}
			<a class:active={week_count == count} class="button-secondary mx-1" href="/students/analytic?week_count={count}">{count}星期</a>
		{/each}
	</div>
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
</div>