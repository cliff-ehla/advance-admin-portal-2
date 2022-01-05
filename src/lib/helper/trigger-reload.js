import {goto} from "$app/navigation";

export const triggerReload = () => {
	// console.log(get(page.path));
	console.log('trigger reload:' + window.location.pathname)
	goto(`${window.location.pathname}?reload=${new Date().getTime()}`)
}