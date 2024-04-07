class LocalPassageStartImage extends HTMLElement {
	constructor() {
		super();
		this.init();
	}

	init() {
		this.attachShadow({ mode: "open" });
		this.shadowRoot.innerHTML = `
            <style>
                .fadein {
                    position: relative;
                    width: 100%;
                    height: auto;
                }
                .fadein img {
                    position: absolute;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: auto;
                    -webkit-animation-name: fade;
                    -webkit-animation-iteration-count: infinite;
                    -webkit-animation-duration: 12s;
                    animation-name: fade;
                    animation-iteration-count: infinite;
                    animation-duration: 12s;
                    image-rendering: crisp-edges;
                }
                
                @-webkit-keyframes fade {
                    0% {opacity: 0;}
                    20% {opacity: 1;}
                    33% {opacity: 1;}
                    53% {opacity: 0;}
                    100% {opacity: 0;}
                }
                @keyframes fade {
                    0% {opacity: 0;}
                    20% {opacity: 1;}
                    33% {opacity: 1;}
                    53% {opacity: 0;}
                    100% {opacity: 0;}
                }

                #img0 {
                    position: relative !important;
                }
                #img1 {
                    -webkit-animation-delay: -8s;
                    animation-delay: -8s;
                }
                #img2 {
                    -webkit-animation-delay: -4s;
                    animation-delay: -4s;
                }
                
            </style>
            <div class="fadein">
                <img id="img0" src="game/_rpgmaker-interface/assets/images/banners/abstract.png">
                <img id="img1" src="game/_rpgmaker-interface/assets/images/banners/forest.png">
                <img id="img2" src="img/misc/banner.png">
            </div>`;
	}
}
customElements.define("local-passage-start-image", LocalPassageStartImage);

function tweakPassageStart() {
	const passageStart = document.getElementById("passage-start");
	if (!passageStart) throw new Error("[tweak passage start] passage-start element not found.");

	/** @type {HTMLImageElement} */
	const img = passageStart.querySelector("img.resize");
	if (!img) throw new Error("[tweak passage start] Image element not found.");
	const newImgContainer = document.createElement("local-passage-start-image");
	img.replaceWith(newImgContainer);
}
