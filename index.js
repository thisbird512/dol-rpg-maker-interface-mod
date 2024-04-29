"use-strict";

const { findMatchingTextNode } = require("./utils/utils");
const { CustomPassageView } = require("./views/custom-passage-view");
const { tweakPassageStart } = require("./views/tweaks/passage-start");

const specialElementIdsEncountered = [];

/**
 * @type {{
 * 	passageId: string,
 * 	passageContainer: HTMLElement,
 * 	latestCustomPassageView: CustomPassageView,
 * 	isAnimatingPassage: boolean,
 * 	elementChanges: {
 * 		added: Array<MutationRecord>,
 * 		removed: Array<MutationRecord>,
 * 	},
 * }} STATE
 */
const STATE = {
	passageId: "",
	passageContainer: null,
	latestCustomPassageView: null,
	isAnimatingPassage: false,
	elementChanges: {
		added: [],
		removed: [],
	},
};

const observerOptions = {
	childList: true,
	subtree: true,
	characterData: true,
	characterDataOldValue: false,
	attributes: false,
	attributeOldValue: false,
};

// ensure other files have loaded
setTimeout(async () => {
	importStyles("game/_rpgmaker-interface/styles/custom-passage-view.css");

	let passageElement = document.getElementById("passages");
	while (!passageElement) {
		await new Promise(resolve => setTimeout(resolve, 100));
		passageElement = document.getElementById("passages");
	}

	// make passage invisible && move special elements to parent, to be visible
	passageElement.style.display = "none";

	// observe mutations
	const observer = new MutationObserver((mutations, observer) => {
		console.log("Mutations: ", mutations);
		for (const mutation of mutations) {
			observer.disconnect();

			// REMOVED NODES =================================================================
			if (mutation.removedNodes.length > 0) {
				console.log("elements removed: ", mutation.removedNodes);
				for (const removedNode of mutation.removedNodes) {
					if (removedNode.nodeType === Node.TEXT_NODE && removedNode.textContent.trim() === "") continue; // empty text, should be ignored

					if (removedNode.nodeType === Node.ELEMENT_NODE) {
						const dataId = removedNode.getAttribute("data-id");
						let correspondingNode = STATE.latestCustomPassageView.querySelector(`[data-id="${dataId}"]`);
						if (!correspondingNode) correspondingNode = STATE.latestCustomPassageView.querySelector("#" + removedNode.id);

						console.log("  removing element node: ", correspondingNode);
						if (correspondingNode) correspondingNode.remove();
					} else if (removedNode.nodeType === Node.TEXT_NODE) {
						const correspondingNode = findMatchingTextNode({ findIn: STATE.latestCustomPassageView, textContent: removedNode.textContent });
						console.log("  removing text node: ", correspondingNode);
						if (correspondingNode) correspondingNode.remove();
					}
				}
			}

			// ADDED NODES ===================================================================
			if (mutation.addedNodes.length > 0) {
				console.log("elements added: ", mutation.addedNodes);
				for (const addedNode of mutation.addedNodes) {
					if (addedNode.nodeType === Node.ELEMENT_NODE && addedNode.getAttribute("data-skip-mutation") === "true") continue; // special case
					if (addedNode.nodeType === Node.ELEMENT_NODE && addedNode.getAttribute("data-id")) continue; // already added
					if (addedNode.nodeType === Node.TEXT_NODE && addedNode.textContent.trim() === "") continue; // empty text, should be ignored
					if (addedNode.nodeType !== Node.ELEMENT_NODE && addedNode.nodeType !== Node.TEXT_NODE) continue; // only handle elements and text nodes

					// Initial setup
					if (addedNode.parentElement === passageElement) STATE.passageId = passageElement.firstChild.id;
					const parent = addedNode.parentElement;
					let correspondingParent = STATE.latestCustomPassageView.querySelector(`[data-id="${parent.getAttribute("data-id")}"]`);
					if (!correspondingParent) correspondingParent = STATE.latestCustomPassageView;

					// Additional setup for element nodes
					if (addedNode.nodeType === Node.ELEMENT_NODE) {
						addedNode.classList.remove("passage-in");
						addedNode.setAttribute("data-id", STATE.latestCustomPassageView.getDataIndex());
					}

					// Handle Element && Text Nodes, by looking at their next sibling
					// No sibling - just append to parent
					// Sibling is element - insert before sibling, from data-id
					// Sibling is text - insert before sibling, from text content match (findMatchingTextNode)
					const nextSibling = addedNode.nextSibling;
					if (!nextSibling) {
						const clonedNode = addedNode.cloneNode();
						correspondingParent.appendChild(clonedNode);
						STATE.latestCustomPassageView.animateCharactersInSection_({ from: addedNode, to: clonedNode });
						console.log("no sibling added:", clonedNode);
					} else if (nextSibling.nodeType === Node.ELEMENT_NODE) {
						const correspondingSibling = correspondingParent.querySelector(`[data-id="${nextSibling.getAttribute("data-id")}"]`);
						const clonedNode = addedNode.cloneNode();
						const innerHTML = addedNode.innerHTML.trim();
						correspondingParent.insertBefore(clonedNode, correspondingSibling);
						if (innerHTML) STATE.latestCustomPassageView.animateCharactersInSection_({ from: addedNode, to: clonedNode });
						console.log("element sibling added:", clonedNode);
					} else if (nextSibling.nodeType === Node.TEXT_NODE) {
						const correspondingSibling = findMatchingTextNode({ findIn: correspondingParent, textContent: nextSibling.textContent });
						console.log("Corresponding sibling text:", correspondingSibling);
						const textNode = document.createTextNode("");
						correspondingParent.insertBefore(textNode, correspondingSibling);
						STATE.latestCustomPassageView.animateCharactersInSection_({ from: addedNode, to: textNode, dontSkipFirstNode: true });
						console.log("text sibling added:", textNode);
					}
				}
			}
			observer.observe(passageElement, observerOptions);
		}
	});

	STATE.passageId = passageElement.firstChild.id;
	observer.observe(passageElement, observerOptions);
	createAndAppendCustomPassageView({ passageElement });
	(() => {
		const treeWalker = document.createTreeWalker(passageElement, NodeFilter.SHOW_ALL, null, false);
		let currentNode = treeWalker.currentNode;
		while (currentNode) {
			if (currentNode.nodeType === Node.ELEMENT_NODE) {
				currentNode.setAttribute("data-id", STATE.latestCustomPassageView.getDataIndex());
			}
			currentNode = treeWalker.nextNode();
		}
	})();
}, 0);

const specialElementIds = [
	"gameVersionDisplay",
	"gameVersionDisplay2",
	"feat",
	"mobileStats",
	"exportWarning",
	"customOverlayContainer",
	"cbtToggleMenu",
	"next",
];

/**
 * @param {any} options
 * @param {HTMLElement} options.passageElement
 * @param {HTMLElement} options.addedNode
 */
async function createAndAppendCustomPassageView({ passageElement } = {}) {
	STATE.isAnimatingPassage = true;

	/** @type {HTMLElement} */
	let passageContainer;
	switch (STATE.passageId) {
		case "passage-start":
			tweakPassageStart();
		default:
			STATE.latestCustomPassageView = document.createElement("custom-passage-view");
			passageContainer = STATE.latestCustomPassageView.initialize();
			passageElement.parentElement.appendChild(STATE.latestCustomPassageView);
			// for (const id of specialElementIds) {
			// 	const element = document.getElementById(id);
			// 	if (element) {
			// 		STATE.latestCustomPassageView.appendChild(element);
			// 		element.remove();
			// 	}
			// }
			await STATE.latestCustomPassageView.animateCharactersInSection_({ from: passageElement, to: passageContainer });
	}
	STATE.isAnimatingPassage = false;
	return STATE.latestCustomPassageView;
}
