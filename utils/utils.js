/**
 * Types of key presses
 * @typedef {"SPACE" | "UP" | "DOWN" | "LEFT" | "RIGHT"} KeyCode
 */

/**
 * Awaits a key press event for the specified key.
 * @param {KeyCode} key
 */
async function awaitKeyPress(key) {
	await new Promise(resolve => {
		function resolveAndStopListening() {
			window.removeEventListener("keydown", handleKeyDown);
			resolve();
		}

		/** @param {KeyboardEvent} ev */
		function handleKeyDown(ev) {
			switch (key) {
				case "SPACE":
					if (ev.key === " " || ev.code === "Space") resolveAndStopListening();
					break;
			}
		}
		window.addEventListener("keydown", handleKeyDown);
	});
}

/**
 * @param {string} str
 * @returns {HTMLElement}
 */
// function stringToElement(str) {
// 	const template = document.createElement("template");
// 	template.innerHTML = str.trim();
// 	return template.content.firstChild;
// }

/**
 * Splits a "source" string into an array of sections by the <br> tag.
 * @param {string} source
 * @example const passageSections = this.segmentPassageToSections(passage.innerHTML)
 * */
// function segmentPassageToSections(source) {
// 	source = source.trim();
// 	const sections = source.split(/<br\s*\/?>/);
// 	const newPassageSections = [];
// 	for (const section of sections) {
// 		if (section.trim() === "") continue;
// 		newPassageSections.push(section.trim());
// 	}
// 	return newPassageSections;
// }

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
