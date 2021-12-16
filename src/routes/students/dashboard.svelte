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
	const lesson_status_summary = big_class_store.getStatusSummary()
	const total_lessons = lesson_status_summary.reduce((a, b) => {
		return b.lesson_count + a
	}, 0)
	const booking_status = big_class_store.getBookingStatus()

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

	const initStudentTrialPie = node => {
		new Chart(node, {
			type: 'pie',
			data: {
				labels: ['大戶', '細戶'],
				datasets: [
					{
						data: [summary.many_ticker_user_count, summary.few_ticker_user_count],
						backgroundColor: [colors.blue, colors.red]
					}
				]
			}
		})
	}

	const initStudentYearPie = node => {
		new Chart(node, {
			type: 'pie',
			data: {
				labels: demand.map(d => d.level),
				datasets: [
					{
						data: demand.map(d => d.user_count),
						backgroundColor: [colors.blue, colors.red, colors.green, colors.orange, colors.blue, colors.red, colors.green, colors.orange, colors.blue]
					}
				]
			}
		})
	}

	const initLessonStatusChart = node => {
		new Chart(node, {
			type: 'pie',
			data: {
				labels: lesson_status_summary.map(d => d.label),
				datasets: [
					{
						data: lesson_status_summary.map(d => d.lesson_count),
						backgroundColor: [colors.blue, colors.red, colors.green, colors.orange]
					}
				]
			}
		})
	}
</script>

<div class="bg-gray-100">
	<h1 class="mb-2 pt-6 px-4 leading-none" style="font-size: 2em">大細班課Dashboard</h1>
	<div class="p-4 max-w-screen-xl">
		<div class="mb-8 flex w-full bg-white p-8 rounded border border-gray-300">
			<div class="w-28">
				<p>學生總數</p>
				<p style="font-size: 4em" class="font-light leading-none">{summary.total_students}</p>
				<div class="mb-8"></div>
				<p>試用學生數</p>
				<p style="font-size: 4em" class="font-light leading-none">{summary.few_ticker_user_count}</p>
			</div>
			<div class="flex-1 flex w-full">
				<div class="flex-1">
					<p class="text-xl font-bold text-center">學生大細戶分佈</p>
					<canvas use:initStudentTrialPie/>
				</div>
				<div class="flex-1">
					<p class="text-xl font-bold text-center">學生年級分佈</p>
					<canvas use:initStudentYearPie/>
				</div>
			</div>
		</div>

		<div class="mb-8 flex bg-white p-8 border border-gray-300 rounded">
			<div class="w-28">
				<div class="mb-8">
					<p>課堂總數</p>
					<p style="font-size: 4em" class="font-light leading-none">{total_lessons}</p>
				</div>
				<div class="mb-8">
					<p>Seat總數</p>
					<p style="font-size: 4em" class="font-light leading-none">{booking_status.total_seat}</p>
				</div>
				<div class="mb-8">
					<p>已book堂數</p>
					<p style="font-size: 4em" class="font-light leading-none">{booking_status.reg_seat}</p>
				</div>
				<div class="mb-8">
					<p>空置率</p>
					<p style="font-size: 4em" class="font-light leading-none">{booking_status.vacancy_date}%</p>
				</div>
			</div>
			<div class="w-full">
				<p class="text-xl font-bold text-center">課堂報名Status</p>
				<canvas use:initLessonStatusChart/>
			</div>
		</div>

		<div class="mb-4 bg-white border border-gray-300 p-8 rounded">
			<p class="text-xl font-bold text-center">課堂供求狀況</p>
			<canvas use:init/>
		</div>

		<div class="grid grid-cols-2 bg-white border border-gray-300 p-8 rounded">
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
	</div>
</div>