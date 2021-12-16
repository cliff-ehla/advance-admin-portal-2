<script context="module">
	import {http, onFail} from "$lib/http";
	import dayjs from "dayjs";

	export const load = async ({page, fetch}) => {
		const {data, success, debug} = await http.post(fetch, '/courseApi/list_registrable_classroom', {
			start_date: dayjs().subtract(3, 'month').format('YYYY-MM-DD HH:mm:ss'),
			end_date: dayjs().add(3, 'month').format('YYYY-MM-DD HH:mm:ss'),
		})
		if (!success) return onFail(debug)
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
	import {Chart, BarController, BarElement, CategoryScale, LinearScale, Title, Tooltip} from 'chart.js'
	Chart.register(BarController, BarElement, CategoryScale, LinearScale, Title, Tooltip)

	export let big_class_list
	console.log(big_class_list)

	const data = {
		labels: demand.map(d => d.level),
		datasets: [{
			label: "Number of student with tickets",
			data: demand.map(d => d.user_count),
			backgroundColor: [
				'rgba(255, 99, 132, 0.2)',
				'rgba(255, 159, 64, 0.2)',
				'rgba(255, 205, 86, 0.2)',
				'rgba(75, 192, 192, 0.2)',
				'rgba(54, 162, 235, 0.2)',
				'rgba(153, 102, 255, 0.2)',
				'rgba(201, 203, 207, 0.2)'
			],
			borderColor: [
				'rgb(255, 99, 132)',
				'rgb(255, 159, 64)',
				'rgb(255, 205, 86)',
				'rgb(75, 192, 192)',
				'rgb(54, 162, 235)',
				'rgb(153, 102, 255)',
				'rgb(201, 203, 207)'
			],
			borderWidth: 1
		}]
	};

	const init = node => {
		new Chart(node, {
			type: 'bar',
			data
		})
	}
</script>

<div class="p-8 max-w-screen-lg">
	<canvas use:init/>
</div>