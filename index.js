"use-strict";

const observerOptions = {
	childList: true,
	subtree: true,
	characterData: true,
	characterDataOldValue: false,
	attributes: false,
	attributeOldValue: false,
};

const specialElementIdsEncountered = [];

const STATE = {
	passageId: "",
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
			}

			// ADDED NODES ===================================================================
			if (mutation.addedNodes.length > 0) {
				STATE.passageId = passageElement.firstChild.id;
				createAndAppendCustomPassageView({ passageElement, addedNode: mutation.addedNodes[0].cloneNode(true) });
			}
			observer.observe(passageElement, observerOptions);
		}

		console.log("STATE: ", STATE);
	});

	STATE.passageId = passageElement.firstChild.id;
	createAndAppendCustomPassageView({ passageElement, addedNode: passageElement.firstChild.cloneNode(true) });
	observer.observe(passageElement, observerOptions);
}, 0);

/** @type {CustomPassageView} */
let latestCustomPassageView;

/** @type {boolean} */
let isWorkingOnPassageView = false;

/** @type {string[]} */
let changesWhileWorkingOnPassageView = [];

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
 * @param {Object} options
 * @param {HTMLElement} options.passageElement
 * @param {HTMLElement} options.addedNode
 */
async function createAndAppendCustomPassageView({ passageElement, addedNode } = {}) {
	if (isWorkingOnPassageView) return;
	isWorkingOnPassageView = true;

	if (latestCustomPassageView) await latestCustomPassageView.remove();
	// passageElement.style.display = "none";

	/** @type {HTMLElement} */
	let passageContainer;
	switch (STATE.passageId) {
		case "passage-start":
			tweakPassageStart();
		default:
			latestCustomPassageView = document.createElement("custom-passage-view");
			passageContainer = latestCustomPassageView.initialize();
			passageElement.parentElement.appendChild(latestCustomPassageView);
			// for (const id of specialElementIds) {
			// 	const element = document.getElementById(id);
			// 	if (element) {
			// 		latestCustomPassageView.appendChild(element);
			// 		element.remove();
			// 	}
			// }

			await latestCustomPassageView.animateCharactersInSection_({ from: passageElement.firstChild, to: passageContainer });
	}
	isWorkingOnPassageView = false;
	return latestCustomPassageView;
}
