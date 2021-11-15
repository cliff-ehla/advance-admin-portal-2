import {http} from "../helpers/http";

export async function listWhatsappMessage ({wrapper_id}, _fetch) {
	try {
		const {data} = await http.post('messageApi/list_whatsapp_message', {
			wrapper_id
		}, _fetch)
		return data
	} catch (e) {}
}

