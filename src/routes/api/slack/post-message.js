import {variables} from "$lib/env";

export const post = async (req) => {
	const res = await fetch('https://slack.com/api/chat.postMessage', {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json; charset=utf-8',
			'Authorization': `Bearer ${variables.slack_bot_token}`
		},
		body: JSON.stringify({
			channel: variables.slack_channel_id,
			text: req.body.text
		})
	})
	return res.json()
}