import dayjs from "dayjs";
import utc from "dayjs/plugin/utc"
import timezone from "dayjs/plugin/timezone"
dayjs.extend(utc)
dayjs.extend(timezone)

/*
	slot: {start_time, end_time, week}
 */
export const convertUtcSlotToLocal = (slots, timezone) => {
	let results = []
	slots.forEach(slot => {
		let local_start_time = dayjs.utc(dayjs().day(slot.week).format("YYYY-MM-DD") + " " + slot.start_time).tz(timezone)
		let local_end_time = dayjs.utc(dayjs().day(slot.week).format("YYYY-MM-DD") + " " + slot.end_time).tz(timezone);
		let converted_results = split(local_start_time, local_end_time)
		results= [...results, ...converted_results]
	})
	return results
}

export const convertLocalSlotToUtc = (slots) => {
	let results = []
	slots.forEach(slot => {
		let utc_start_time = dayjs(dayjs().day(slot.week).format("YYYY-MM-DD") + " " + slot.start_time).utc()
		let utc_end_time = dayjs(dayjs().day(slot.week).format("YYYY-MM-DD") + " " + slot.end_time).utc()
		let converted_results = split(utc_start_time, utc_end_time)
		results= [...results, ...converted_results]
	})
	return results
}

const split = (start_time, end_time) => {
	let results = []
	let is_same_day = start_time.isSame(end_time, 'day')
	if (is_same_day) {
		results.push({
			week: dayjs(start_time).day(),
			start_time: start_time.format('HH:mm:ss'),
			end_time: end_time.format('HH:mm:ss')
		})
	} else {
		let first_half = {
			end_time: '23:59:59',
			start_time: start_time.format('HH:mm:ss'),
			week: dayjs(start_time).day()
		}
		let second_half = {
			start_time: '00:00:00',
			end_time: end_time.format('HH:mm:ss'),
			week: dayjs(end_time).day()
		}
		results.push(first_half)
		results.push(second_half)
	}
	return results
}

export const mergeConsecutiveSlots = (slots) => {
	// TODO
	let slots_end_with_59 = []
	slots.forEach(slot => {
		let is_59 = dayjs(slot.end_time).format('ss') === '59'
		console.log(is_59)
		slots_end_with_59.push()
	})

}