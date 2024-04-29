/**
 * Types of key presses
 * @typedef {"SPACE" | "UP" | "DOWN" | "LEFT" | "RIGHT"} KeyCode
 */

/**
 * Return type of awaitKeyPress
 * @typedef {{ promise: Promise<void>, stopListening: (keyPressed: KeyCode) => void }} AwaitKeyPressReturnType
 */

/**
 * Awaits a key press event for the specified key.
 * @param {KeyCode} key
 * @returns {AwaitKeyPressReturnType}
 */
function awaitKeyPress(key) {
	let resolvePromise;
	const promise = new Promise(resolve => (resolvePromise = resolve));

	function resolveAndStopListening(keyPressed) {
		console.log("Key pressed:", keyPressed);
		window.removeEventListener("keydown", handleKeyDown);
		resolvePromise();
	}

	/** @param {KeyboardEvent} ev */
	function handleKeyDown(ev) {
		ev.stopPropagation();
		if (key === "SPACE" && (ev.key === " " || ev.code === "Space")) resolveAndStopListening("SPACE");
		// if (key === "LEFT" && (ev.key === "ArrowLeft" || ev.KeyCode == "37")) resolveAndStopListening("LEFT");
		// if (key === "RIGHT" && (ev.key === "ArrowRight" || ev.KeyCode == "39")) resolveAndStopListening("RIGHT");

		// switch (key) {
		// 	case "LEFT":
		// 		resolveAndStopListening("LEFT");
		// 		break;
		// 	case "RIGHT":
		// 		resolveAndStopListening("RIGHT");
		// 		break;
		// 	case "SPACE":
		// 		if (ev.key === " " || ev.code === "Space") resolveAndStopListening("SPACE");
		// 		break;
		// }
	}

	window.addEventListener("keydown", handleKeyDown);

	return {
		promise,
		stopListening: resolveAndStopListening,
	};
}

/**
 * @param {{ findIn: Node, textContent: string }} param0
 * @param {Node} param0.findIn - The node to search in
 * @param {string} param0.textContent - The text content to search for
 */
function findMatchingTextNode({ findIn, textcontent }) {
	if (!findIn) throw new Error("findIn is required");
	if (!textcontent) throw new Error("textContent is required");

	textcontent = textcontent.trim();
	for (const node of findIn.childNodes) {
		if (node.nodeType !== Node.TEXT_NODE) continue;
		if (node.textContent.trim() === textcontent) return node;
	}

	return null;
}

/**
 * @param {{findIn: HTMLElement, givenElement: HTMLElement, elementTag: string, innerHTML: string}} param0
 * */
// function findMatchingElementInPassages(givenElement, elementTag, innerHTML) {
// function findMatchingElementIn({ findIn, givenElement, elementTag, innerHTML }) {
// 	const givenElementAttributes = givenElement.attributes;
// 	const foundElements = findIn.querySelectorAll(elementTag);
// 	outer: for (const element of foundElements) {
// 		for (const attribute of givenElementAttributes) {
// 			if (element.getAttribute(attribute.name) !== attribute.value) {
// 				continue outer;
// 			}
// 		}
// 		if (element.innerHTML.trim() === innerHTML.trim()) return element;
// 	}

// 	console.log("No matching element found for", givenElement);
// 	return null;
// }

module.exports = { awaitKeyPress, findMatchingTextNode };
