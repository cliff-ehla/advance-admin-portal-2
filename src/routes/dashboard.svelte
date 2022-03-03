<script context="module">
	import dayjs from "dayjs";
	import {big_class_store} from "$lib/store/big-class-store.js";

	export const load = async ({page, fetch}) => {
		await big_class_store.callIfNoCache(fetch, {
			month: dayjs().format('YYYY-MM')
		})
		const diff = dayjs(dayjs().endOf('month')).diff(dayjs(),'day')
		if (diff < 7) {
			await big_class_store.callIfNoCache(fetch, {
				month: dayjs().add(1,'month').format('YYYY-MM')
			})
		}
		return true
	}
</script>

<script>
	import {student_store} from "../store/student-store.js";
	import {student_analytic} from "$lib/store/student-analytic.js";
	import tippy from "tippy.js";
	const demand = student_store.getLessonDemand()
	import Icon from '$lib/ui-elements/icon.svelte'
	import {classroom_analytic} from "$lib/store/big-class-store.js";
	import DemandSupply from '$lib/dashboard/demand-supply-by-level-bar-chart.svelte'
	import VacancyBarChar from '$lib/dashboard/vacancy-by-level-bar-chart.svelte'
	import LanguageByLevelBarChar from '$lib/dashboard/lesson-language-by-level-bar-chart.svelte'

	const colors = {
		blue: 'rgba(54, 162, 235, 0.6)',
		red: 'rgba(255, 99, 132, 0.6)',
		green: 'rgba(75, 192, 192, 0.6)',
		orange: 'rgba(255, 159, 64, 0.6)'
	}
	const start_date = dayjs().format('DD MMM YYYY')
	const end_date = dayjs().add(2, 'month').format('DD MMM YYYY')

	const initStudentTrialPie = node => {
		new Chart(node, {
			type: 'pie',
			data: {
				labels: ['試用新戶', '大戶', '需跟進戶'],
				datasets: [
					{
						data: [$student_analytic.new_user_count, $student_analytic.many_ticker_user_count, $student_analytic.few_ticker_user_count],
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
	
	const onRangeClick = (option) => {
		if (option.days > 7) {
			big_class_store.callIfNoCache(fetch, {
				month: dayjs().add(1,'month').format('YYYY-MM')
			})
		}
		if (option.days > 50) {
			big_class_store.callIfNoCache(fetch, {
				month: dayjs().add(2,'month').format('YYYY-MM')
			})
		}
		classroom_analytic.setRange(option.days)
	}
</script>

<div class="bg-gray-100">
	<h1 class="mb-2 pt-6 px-4 leading-none" style="font-size: 2em">大細班課Dashboard</h1>
	<div class="p-4 max-w-screen-xl">
		<div class="mb-8 flex w-full bg-white p-8 rounded border border-gray-300">
			<a href="/students/classroom" class="block hover:text-blue-500 w-28">
				<p>學生總數</p>
				<p style="font-size: 4em" class="font-light leading-none">{$student_analytic.total_students}</p>
				<div class="mb-8"></div>
				<p>試用新戶</p>
				<p style="font-size: 4em" class="font-light leading-none">{$student_analytic.new_user_count}</p>
			</a>
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
					<button on:click={() => {onRangeClick(option)}}
					        class:active={option.days === $classroom_analytic.time_range}
					        class="normal button-secondary mx-1">
						{option.label}
					</button>
				{/each}
			</div>
		</div>
		<div class="mb-8 flex bg-white p-8 border border-gray-300 rounded">
			<div class="w-48 flex-shrink-0">
				<div class="flex mb-6 border-b border-gray-300 pb-6">
					<div>
						<p>課堂總數</p>
						<p style="font-size: 4em" class="font-light leading-none">{$classroom_analytic.classroom.total_count}</p>
					</div>
					<div class="ml-auto">
						<p class="text-red-800">冇人報的堂</p>
						<p style="font-size: 4em" class="font-light leading-none text-red-400">{$classroom_analytic.classroom.chart[0].lesson_count}</p>
					</div>
				</div>
				<div class="flex mb-2">
					<div>
						<p>Seat位總數</p>
						<p style="font-size: 3.2em" class="font-light leading-none">{$classroom_analytic.seat.total_count}</p>
					</div>
					<div class="ml-auto mt-auto mb-1">
						<p>已Book</p>
						<p style="font-size: 3.2em" class="font-light leading-none">{$classroom_analytic.seat.reg_count}</p>
					</div>
				</div>
				<div class="mb-8 bg-gray-100 text-center flex py-2 px-4 rounded text-gray-500">
					<p class="mt-auto mb-0.5">空置率</p>
					<p style="font-size: 2.8em" class="ml-auto font-light leading-none">{$classroom_analytic.seat.vacancy_rate}%</p>
				</div>
			</div>
			<div class="w-full">
				<p class="text-xl font-bold text-center">課堂報名Status</p>
				<canvas use:initLessonStatusChart={$classroom_analytic.classroom.chart}/>
			</div>
		</div>

		<DemandSupply/>

		<div class="grid grid-cols-2 gap-8 bg-white border border-gray-300 p-8 rounded">
			<div class="mb-4">
				<VacancyBarChar/>
			</div>
			<div class="mb-4">
				<LanguageByLevelBarChar/>
			</div>
		</div>
	</div>
</div>