<script>
	import SelectionBox from './selection-box.svelte'
	
	export let start_time_string
	
	const genTimeOptions = () => {
		let options = []
		let hours = [12,1,2,3,4,5,6,7,8,9,10,11]
		let mins = ['00', '15', '30', '45']
		let ampm = ['am', 'pm']
		ampm.forEach(a => {
			hours.forEach(h => {
				mins.forEach(min => {
					let value_h = h
					let label_h = h
					if (value_h === 12) value_h = 0
					if (a === 'pm') value_h += 12
					value_h = String(value_h).padStart(2, '0')
					options.push({
						value: `${value_h}:${min}:00`,
						label: `${label_h}:${min}${a}`
					})
				})
			})
		})
		return options
	}
</script>

<SelectionBox options={genTimeOptions()} on:input selected_value={start_time_string}/>