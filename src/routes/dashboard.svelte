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
	import {student_store} from "../store/student-store.js";
	import tippy from "tippy.js";
	const demand = student_store.getLessonDemand()
	const summary = student_store.getSummary()
	import Icon from '$lib/ui-elements/icon.svelte'
	import {classroom_analytic} from "$lib/store/big-class-store.js";
	import DemandSupply from '$lib/dashboard/demand-supply-by-level-bar-chart.svelte'
	import VacancyBarChar from '$lib/dashboard/vacancy-by-level-bar-chart.svelte'
	$: {
		console.log(123, $classroom_analytic)
	}

	export let big_class_list
	const colors = {
		blue: 'rgba(54, 162, 235, 0.6)',
		red: 'rgba(255, 99, 132, 0.6)',
		green: 'rgba(75, 192, 192, 0.6)',
		orange: 'rgba(255, 159, 64, 0.6)'
	}
	const start_date = dayjs().format('DD MMM YYYY')
	const end_date = dayjs().add(2, 'month').format('DD MMM YYYY')
	const level_stat = $classroom_analytic.by_level



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

	const initStudentTrialPie = node => {
		new Chart(node, {
			type: 'pie',
			data: {
				labels: ['試用新戶', '大戶', '需跟進戶'],
				datasets: [
					{
						data: [summary.new_user_count, summary.many_ticker_user_count, summary.few_ticker_user_count],
						backgroundColor: [colors.green, colors.blue, colors.red]
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
						backgroundColor: ['#AAD5FB', '#77BFFF', '#49A1EF',
							'#ACE4E4', '#75CBCB', '#0FC3C3',
						'#FCCFA1', '#EBAA69', '#F28B21']
					}
				]
			}
		})
	}

	const initLessonStatusChart = (node, chart_data) => {
		const chart = new Chart(node, {
			type: 'pie',
			data: {
				labels: chart_data.map(d => d.label),
				datasets: [
					{
						data: chart_data.map(d => d.lesson_count),
						backgroundColor: [colors.red, colors.orange, colors.blue, colors.green]
					}
				]
			}
		})
		return {
			update: chart_data => {
				chart.data.datasets.forEach((dataset) => {
					dataset.data = chart_data.map(d => d.lesson_count)
				});
				chart.update()
			}
		}
	}

	const tooltip = node => {
		tippy(node, {
			content: '細戶即Ticket數少於6張'
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
				<p>試用新戶</p>
				<p style="font-size: 4em" class="font-light leading-none">{summary.new_user_count}</p>
			</div>
			<div class="flex-1 flex w-full">
				<div class="flex-1">
					<div class="flex items-center justify-center">
						<p class="text-xl font-bold text-center">學生大細戶分佈</p>
						<span class="w-6 h-6 cc rounded border border-gray-400 ml-2" use:tooltip><Icon name="info" className="w-4"/></span>
					</div>
					<canvas use:initStudentTrialPie/>
				</div>
				<div class="flex-1">
					<p class="text-xl font-bold text-center">學生年級分佈</p>
					<canvas use:initStudentYearPie/>
				</div>
			</div>
		</div>

		<div class="px-4 py-2 bg-white top-0 sticky mb-4 border-b border-gray-300 flex items-center">
			<p class="font-light leading-tight" style="font-size: 1.5em">
				未來{$classroom_analytic.time_label}
			</p>
			<p class="text-gray-500 ml-2">{dayjs().format('DD MMM YYYY')} - {dayjs().add($classroom_analytic.time_range, 'day').format('DD MMM YYYY')}</p>
			<div class="ml-auto">
				{#each $classroom_analytic.time_range_options as option}
					<button on:click={() => {classroom_analytic.setRange(option.days)}}
					        class:active={option.days === $classroom_analytic.time_range}
					        class="normal button-secondary mx-1">
						{option.label}
					</button>
				{/each}
			</div>
		</div>
		<div class="mb-8 flex bg-white p-8 border border-gray-300 rounded">
			<div class="w-28">
				<div class="mb-8">
					<p>課堂總數</p>
					<p style="font-size: 4em" class="font-light leading-none">{$classroom_analytic.classroom.total_count}</p>
				</div>
				<div class="mb-8">
					<p>Seat總數</p>
					<p style="font-size: 4em" class="font-light leading-none">{$classroom_analytic.seat.total_count}</p>
				</div>
				<div class="mb-8">
					<p>已book堂數</p>
					<p style="font-size: 4em" class="font-light leading-none">{$classroom_analytic.seat.reg_count}</p>
				</div>
				<div class="mb-8">
					<p>空置率</p>
					<p style="font-size: 4em" class="font-light leading-none">{$classroom_analytic.seat.vacancy_rate}%</p>
				</div>
			</div>
			<div class="w-full">
				<p class="text-xl font-bold text-center">課堂報名Status</p>
				<canvas use:initLessonStatusChart={$classroom_analytic.classroom.chart}/>
			</div>
		</div>

		<DemandSupply/>

		<div class="grid grid-cols-2 bg-white border border-gray-300 p-8 rounded">
			<div class="mb-4">
				<VacancyBarChar/>
			</div>
			<div class="mb-4">
				<p class="text-xl font-bold text-center">外敎與雙語課堂比例</p>
				<canvas use:initLanguageChart/>
			</div>
		</div>
	</div>
</div>