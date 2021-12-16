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
	const colors = {
		blue: 'rgba(54, 162, 235, 0.6)',
		red: 'rgba(255, 99, 132, 0.6)',
		green: 'rgba(75, 192, 192, 0.6)',
		orange: 'rgba(255, 159, 64, 0.6)'
	}

	const initVacancyChart = node => {
		new Chart(node, {
			type: 'bar',
			data: {
				labels: demand.map(d => d.level),
				datasets: [
					{
						data: big_class_store.getLevelStat().map(d => d.reg_seat),
						label: 'Registered Seat',
						stack: 'stack 1',
						backgroundColor: colors.green
					},
					{
						data: big_class_store.getLevelStat().map(d => d.vacant_seat),
						label: 'Vacant Seat',
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
						label: "Student demand",
						data: demand.map(d => d.lesson_demand),
						backgroundColor: 'rgba(54, 162, 235, 0.2)',
						borderColor: 'rgb(54, 162, 235)',
						borderWidth: 1,
						stack: 'Stack 0',
					},
					{
						label: "Native Classroom supply",
						data: big_class_store.getLevelStat().map(obj => obj.native_lesson_count),
						backgroundColor: 'rgba(255, 159, 64, 0.2)',
						borderColor: 'rgb(255, 159, 64)',
						borderWidth: 1,
						stack: 'Stack 1',
					},
					{
						label: "Bilingual Classroom supply",
						data: big_class_store.getLevelStat().map(obj => obj.bilingual_lesson_count),
						backgroundColor: 'rgba(255, 99, 132, 0.2)',
						borderColor: 'rgb(255, 99, 132)',
						borderWidth: 1,
						stack: 'Stack 1',
					}
				]
			}
		})
	}
</script>


<div class="p-8 max-w-screen-lg">
	<div class="mb-4">
		<p class="text-xl font-bold text-center">課堂供求狀況</p>
		<canvas use:init/>
	</div>
	<div class="mb-4">
		<p class="text-xl font-bold text-center">課堂空置狀況</p>
		<canvas use:initVacancyChart/>
	</div>
</div>