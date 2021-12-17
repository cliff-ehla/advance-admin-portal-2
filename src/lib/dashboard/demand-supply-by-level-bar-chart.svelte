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

	const init = (node, _level_stat) => {
		const getDatasets = (level_stat) => {
			return [
				{
					label: "試用新戶",
					data: demand.map(d => d.new_user_count),
					backgroundColor: 'rgba(255, 99, 132, 0.2)',
					borderColor: 'rgba(255, 99, 132, 1)',
					borderWidth: 1,
					stack: 'Stack 0',
				},
				{
					label: "需跟進戶",
					data: demand.map(d => d.few_ticker_user_count),
					backgroundColor: 'rgba(255, 159, 64, 0.2)',
					borderColor: 'rgba(255, 159, 64, 1)',
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
		const chart = new Chart(node, {
			type: 'bar',
			data: {
				labels: demand.map(d => d.level),
				datasets: getDatasets(_level_stat)
			}
		})
		return {
			update: (_level_stat) => {
				chart.data.datasets = getDatasets(_level_stat)
				chart.update()
			}
		}
	}

</script>

<div class="mb-4 bg-white border border-gray-300 p-8 rounded">
	<p class="text-xl font-bold text-center">課堂供求狀況</p>

	<canvas use:init={$classroom_analytic.by_level}/>
</div>