import tippy from "tippy.js";

export const tooltip = (node, message) => {
	tippy(node, {
		content: message
	})
}