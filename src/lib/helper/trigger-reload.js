import {goto} from "$app/navigation";

export const triggerReload = () => {
	goto(`${window.location.pathname}?reload=${new Date().getTime()}`)
}