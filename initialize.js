const { SETTINGS } = require("./settings");

/**
 * Initializes the game interface.
 */
function initializeControls() {
	const speedController = document.createElement("custom-speed-controller");
	document.body.appendChild(speedController);
}

class CustomSpeedController extends HTMLElement {
	constructor() {
		super();
		this.attachShadow({ mode: "open" });
		this.render();
	}

	render() {
		this.shadowRoot.innerHTML = `
        <style>
            .button-container {
                position: fixed;
                bottom: 15px;
                right: 15px;
                display: flex;
                gap: 2px;
            }

            .button {
                display: inline-block;
                border: 1px solid black;
                width: 15px;
                height: 15px;
                cursor: pointer;
                transition: background-color 0.3s ease;
            }

            .button:hover {
                background-color: #f0f0f0;
            }

            .button svg {
                vertical-align: middle;
            }
        </style>
        
        <div class="button-container">
            <div class="button" id="decrease">
                <?xml version="1.0" encoding="utf-8"?><!-- Uploaded to: SVG Repo, www.svgrepo.com, Generator: SVG Repo Mixer Tools --><svg width="20px" height="20px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M6 12L18 12" stroke="#000000" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>
            </div
            <div class="button" id="skip">
                <?xml version="1.0" encoding="utf-8"?><!-- Uploaded to: SVG Repo, www.svgrepo.com, Generator: SVG Repo Mixer Tools --><svg width="20px" height="20px" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg" fill="none"><g fill="#000000"><path fill-rule="evenodd" d="M4.76 2.5C3.6 1.682 2 2.51 2 3.93v8.14c0 1.419 1.6 2.248 2.76 1.43l5.765-4.07a1.75 1.75 0 000-2.86L4.76 2.5zM3.5 3.93a.25.25 0 01.394-.204l5.766 4.07a.25.25 0 010 .408l-5.766 4.07a.25.25 0 01-.394-.204V3.93z" clip-rule="evenodd"/><path d="M14 3a.75.75 0 00-1.5 0v10a.75.75 0 001.5 0V3z"/></g></svg>
            </div>
            <div class="button" id="increase">
                <?xml version="1.0" encoding="utf-8"?><!-- Uploaded to: SVG Repo, www.svgrepo.com, Generator: SVG Repo Mixer Tools --><svg width="20px" height="20px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M6 12H18M12 6V18" stroke="#000000" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>
            </div>
        </div>`;

		this.shadowRoot.querySelector("#decrease").addEventListener("click", () => SETTINGS.textSpeed.decrease());
		this.shadowRoot.querySelector("#increase").addEventListener("click", () => SETTINGS.textSpeed.increase());
		this.shadowRoot.querySelector("#skip").addEventListener("click", () => SETTINGS.textSpeed.skip());
	}
}
customElements.define("custom-speed-controller", CustomSpeedController);
