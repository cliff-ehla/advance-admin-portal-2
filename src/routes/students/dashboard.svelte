<script context="module">
	import {http, onFail} from "$lib/http";
	import dayjs from "dayjs";
	import {big_class_store} from "$lib/store/big-class-store.js";

	export const load = async ({page, fetch}) => {
		const {data, success, debug} = await http.post(fetch, '/courseApi/list_registrable_classroom', {
			start_date: dayjs().format('YYYY-MM-DD HH:mm:ss'),
			end_date: dayjs().add(2, 'month').format('YYYY-MM-DD HH:mm:ss'),
		})
		if (!success) return onFail(debug)
		big_class_store.set(data)
		return {
			props: {
				big_class_list: data
			}
		}
	}
</script>

<script>
	import {student_store} from "../../store/student-store.js";
	const demand = student_store.getLessonDemand()
	const summary = student_store.getSummary()


	export let big_class_list
	const colors = {
		blue: 'rgba(54, 162, 235, 0.6)',
		red: 'rgba(255, 99, 132, 0.6)',
		green: 'rgba(75, 192, 192, 0.6)',
		orange: 'rgba(255, 159, 64, 0.6)'
	}
	const start_date = dayjs().format('DD MMM YYYY')
	const end_date = dayjs().add(2, 'month').format('DD MMM YYYY')
	const level_stat = big_class_store.getLevelStat()
	const total_lessons = level_stat.reduce((a, b) => {
		return b.lesson_count + a
	}, 0)
	const total_seat = level_stat.reduce((a, b) => {
		return b.reg_seat + b.vacant_seat + a
	}, 0)

	const initVacancyChart = node => {
		new Chart(node, {
			type: 'bar',
			data: {
				labels: demand.map(d => d.level),
				datasets: [
					{
						data: level_stat.map(d => d.reg_seat),
						label: 'Registered Seat',
						stack: 'stack 1',
						backgroundColor: colors.green
					},
					{
						data: level_stat.map(d => d.vacant_seat),
						label: 'Vacant Seat',
						stack: 'stack 1',
						backgroundColor: colors.orange
					}
				]
			}
		})
	}

	const initLanguageChart = node => {
		new Chart(node, {
			type: 'bar',
			data: {
				labels: demand.map(d => d.level),
				datasets: [
					{
						data: level_stat.map(d => d.native_lesson_count),
						label: 'Native',
						stack: 'stack 1',
						backgroundColor: colors.green
					},
					{
						data: level_stat.map(d => d.bilingual_lesson_count),
						label: 'Bilingual Seat',
						stack: 'stack 1',
						backgroundColor: colors.orange
					}
				]
			}
		})
	}

	const init = node => {
		new Chart(node, {
			type: 'bar',
			data: {
				labels: demand.map(d => d.level),
				datasets: [
					{
						label: "小戶人數",
						data: demand.map(d => d.few_ticker_user_count),
						backgroundColor: 'rgba(255, 99, 132, 0.2)',
						borderColor: 'rgba(255, 99, 132, 1)',
						borderWidth: 1,
						stack: 'Stack 0',
					},
					{
						label: "大戶人數",
						data: demand.map(d => d.many_ticker_user_count),
						backgroundColor: 'rgba(75, 192, 192, 0.2)',
						borderColor: 'rgba(75, 192, 192, 1)',
						borderWidth: 1,
						stack: 'Stack 0',
					},
					{
						label: "無人報",
						data: level_stat.map(obj => obj.empty_lesson_count),
						backgroundColor: colors.red,
						stack: 'Stack 1',
					},
					{
						label: "得一個人",
						data: level_stat.map(obj => obj.only_one_ppl_lesson_count),
						backgroundColor: colors.orange,
						stack: 'Stack 1',
					},
					{
						label: "2-3人",
						data: level_stat.map(obj => obj.enough_ppl_lesson_count),
						backgroundColor: colors.blue,
						stack: 'Stack 1',
					},
					{
						label: "滿員",
						data: level_stat.map(obj => obj.only_one_ppl_lesson_count),
						backgroundColor: colors.green,
						stack: 'Stack 1',
					}
				]
			}
		})
	}
</script>

<div class="p-8 max-w-screen-lg">
	<div class="mb-4 grid grid-cols-3 gap-4">
		<div>
			<p>學生總數</p>
			<p style="font-size: 4em" class="font-bold leading-none">{summary.total_students}</p>
		</div>
		<div>
			<p>課堂總數</p>
			<p style="font-size: 4em" class="font-bold leading-none">{total_lessons}</p>
		</div>
		<div>
			<p>Seat總數</p>
			<p style="font-size: 4em" class="font-bold leading-none">{total_seat}</p>
		</div>
	</div>

	<div class="mb-4">
		<p class="text-xl font-bold text-center">課堂供求狀況</p>
		<canvas use:init/>
	</div>
	<div class="mb-4">
		<p class="text-xl font-bold text-center">課堂空置狀況</p>
		<p class="text-center text-sm text-gray-400">{start_date} - {end_date}</p>
		<canvas use:initVacancyChart/>
	</div>
	<div class="mb-4">
		<p class="text-xl font-bold text-center">外敎與雙語課堂比例</p>
		<p class="text-center text-sm text-gray-400">{start_date} - {end_date}</p>
		<canvas use:initLanguageChart/>
	</div>
</div>