import {writable} from "svelte/store";

function createDialogStore () {
	const store = writable({
		visible: false,
		title: '',
		message: '',
		onConfirm: () => {},
		onSuccess: () => {}
	})
	const confirm = ({message, title, onConfirm, onSuccess}) => {
		store.set({
			visible: true,
			title: title || '你確定？',
			message,
			onConfirm,
			onSuccess
		})
	}
	const close = () => {
		store.set({
			visible: false,
			title: '',
			message: '',
			onConfirm: () => {},
			onSuccess: () => {}
		})
	}
	return {
		subscribe: store.subscribe,
		confirm,
		close
	}
}

export const dialog = createDialogStore()