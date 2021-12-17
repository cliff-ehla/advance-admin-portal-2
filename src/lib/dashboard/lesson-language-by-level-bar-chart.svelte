<script>
	import {student_store} from "../../store/student-store.js";
	import {classroom_analytic} from "$lib/store/big-class-store.js";
	const colors = {
		blue: 'rgba(54, 162, 235, 0.6)',
		red: 'rgba(255, 99, 132, 0.6)',
		green: 'rgba(75, 192, 192, 0.6)',
		orange: 'rgba(255, 159, 64, 0.6)'
	}
	const demand = student_store.getLessonDemand()
	const initLanguageChart = (node, by_level) => {
		const getDatasets = (_by_level) => {
			return [
				{
					data: _by_level.map(d => d.native_lesson_count),
					label: 'Native',
					stack: 'stack 1',
					backgroundColor: colors.green
				},
				{
					data: _by_level.map(d => d.bilingual_lesson_count),
					label: 'Bilingual Seat',
					stack: 'stack 1',
					backgroundColor: colors.orange
				}
			]
		}
		const chart = new Chart(node, {
			type: 'bar',
			data: {
				labels: demand.map(d => d.level),
				datasets: getDatasets(by_level)
			}
		})
		return {
			update: _by_level => {
				chart.data.datasets = getDatasets(_by_level)
				chart.update()
			}
		}
	}
</script>

<p class="text-xl font-bold text-center">外敎與雙語課堂比例</p>
<canvas use:initLanguageChart={$classroom_analytic.by_level}/>