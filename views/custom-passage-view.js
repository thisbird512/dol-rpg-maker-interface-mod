const { SETTINGS } = require("../settings");

class CustomPassageView extends HTMLElement {
	/** @type {HTMLElement} */
	passageContainer;

	/**
	 * Call right after constructor. Initializes the passage container and appends it to the custom passage view.
	 * */
	initialize() {
		this.id = "custom-passage-view";
		const passageContainer = document.createElement("div");
		passageContainer.classList.add("passage");
		passageContainer.classList.add("custom-passage-container");
		this.appendChild(passageContainer);
		this.passageContainer = passageContainer;
		return passageContainer;
	}

	/** Removes node. Promise resolved when all process have stopped */
	async remove() {
		super.remove();
		this.shouldContinue = false;
		while (!this.disContinued) await new Promise(resolve => setTimeout(resolve, 5));
		this.shouldContinue = true;
		this.disContinued = false;
	}

	shouldContinue = true;
	disContinued = false;
	specialElementIds = ["gameVersionDisplay", "gameVersionDisplay2", "feat", "mobileStats", "exportWarning", "customOverlayContainer", "cbtToggleMenu", "next"];

	_currentIndex = 0;
	getDataIndex() {
		this._currentIndex++;
		if (this._currentIndex > 10000000) this._currentIndex = 0;
		return this._currentIndex;
	}

	// generateTextIndexSpan() {
	// 	const span = document.createElement("span");
	// 	span.style.display = "none";
	// 	span.setAttribute("data-id", this.getDataIndex());
	// 	span.setAttribute("data-skip-mutation", "true");
	// 	return span;
	// }

	/**
	 * @param {{from: HTMLElement, to: HTMLElement, passageElement: HTMLElement}} param0
	 * @param {number} depth
	 */
	async animateCharactersInSection_({ from, to, skip, dontSkipFirstNode }, depth = 0) {
		if (!this.passageContainer) throw new Error("Passage container not initialized");
		if (!this.shouldContinue) return (this.disContinued = true);
		if (!from) throw new Error("FROM container not given");
		if (!to) throw new Error("TO container not given");

		const waitTick = () => {
			let waitTime = 10;
			switch (SETTINGS.textSpeed.value) {
				case 1:
					waitTime = 30;
					break;
				case 2:
					waitTime = 10;
					break;
				case 3:
					waitTime = 5;
					break;
				case 4:
					waitTime = 1;
					break;
			}
			if (SETTINGS.textSpeed.value === -1 || skip) waitTime = 0;
			return new Promise(resolve => setTimeout(resolve, waitTime));
		};
		const treeWalker = document.createTreeWalker(from, NodeFilter.SHOW_ALL, null, false);
		if (!dontSkipFirstNode) treeWalker.nextNode();

		let currentNode = treeWalker.currentNode;
		outerLoop: while (currentNode) {
			if (!this.shouldContinue) return (this.disContinued = true);

			if (currentNode.nodeType === Node.TEXT_NODE) {
				// if (currentNode.textContent.trim() === "") {
				// 	currentNode = treeWalker.nextNode();
				// 	continue outerLoop;
				// }

				// const textIndexSpan = this.generateTextIndexSpan();
				// currentNode.parentElement.insertBefore(textIndexSpan, currentNode);
				// to.appendChild(textIndexSpan.cloneNode());
				const clonedNode = currentNode.cloneNode();
				const textNode = document.createTextNode("");
				to.appendChild(textNode);
				for (const char of clonedNode.textContent) {
					if (!this.shouldContinue) return (this.disContinued = true);
					textNode.textContent += char;
					if (["\n", "\t", " "].includes(char)) continue;
					await waitTick();
				}

				currentNode = treeWalker.nextNode();
			} else if (currentNode.nodeType === Node.ELEMENT_NODE) {
				currentNode.setAttribute("data-id", this.getDataIndex());
				const clonedNode = currentNode.cloneNode(true);
				clonedNode.classList.remove("passage-in");
				const innerHTML = clonedNode.innerHTML.trim();
				clonedNode.innerHTML = "";

				switch (clonedNode.tagName) {
					case "span":
						to.appendChild(document.createTextNode(" "));
						to.appendChild(clonedNode);
						to.appendChild(document.createTextNode(" "));
						break;
					case "A":
						to.appendChild(clonedNode);
						const originalANode = currentNode;
						clonedNode.addEventListener("click", () => originalANode.click());
						break;
					case "BUTTON":
						to.appendChild(clonedNode);
						const originalButtonNode = currentNode;
						clonedNode.addEventListener("click", () => originalButtonNode.click());
						break;
					case "INPUT":
						to.appendChild(clonedNode);
						const originalInputNode = currentNode;
						clonedNode.value = originalInputNode.value;
						clonedNode.addEventListener("change", () => {
							originalInputNode.value = clonedNode.value;
							originalInputNode.dispatchEvent(new Event("change"));
						});
						break;
					case "svg":
						to.appendChild(clonedNode);
						/** @type {ChildNode} */
						let childNode = currentNode.firstChild;
						while (childNode) {
							const clonedChild = childNode.cloneNode();
							clonedNode.appendChild(clonedChild);
							if (clonedChild.tagName === "A") {
								const originalChildNode = childNode;
								clonedChild.addEventListener("click", () => originalChildNode.click());
							}
							childNode = childNode.nextSibling();
						}
						currentNode = treeWalker.nextSibling();
						continue outerLoop;
					default:
						to.appendChild(clonedNode);
						break;
				}

				if (innerHTML) {
					await this.animateCharactersInSection_({ from: currentNode, to: clonedNode }, depth + 1);
				}
				currentNode = treeWalker.nextSibling();
			} else {
				// Add, but don't animate, to keep count & structure in sync
				to.appendChild(currentNode.cloneNode(true));
				currentNode = treeWalker.nextNode();
			}
		}

		this.disContinued = true;
		if (depth === 0) {
			// for (const key in ["SPACE", "LEFT", "RIGHT"]) {
			// for (const key in ["SPACE"]) {
			// }
			// awaitedKeyPresses.SPACE.stopListening();
		}
	}
}

customElements.define("custom-passage-view", CustomPassageView);

module.exports = { CustomPassageView };
