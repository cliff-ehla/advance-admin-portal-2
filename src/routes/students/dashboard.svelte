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
		console.log(big_class_store.getLevelStat())
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

	export let big_class_list
	console.log(demand.map(d => d.user_count))

	const data = {
		labels: demand.map(d => d.level),
		datasets: [
			{
				label: "Student demand",
				data: demand.map(d => d.lesson_demand),
				backgroundColor: 'rgba(255, 99, 132, 0.2)',
				borderColor: 'rgb(255, 99, 132)',
				borderWidth: 1
			},
			{
				label: "Classroom supply",
				data: big_class_store.getLevelStat().map(obj => obj.lesson_count),
				backgroundColor: 'rgba(255, 159, 64, 0.2)',
				borderColor: 'rgb(255, 159, 64)',
				borderWidth: 1
			}
		]
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