export default class Config {
	container!: HTMLElement;
	items!: string;
	autoCloseOnOpen: boolean = true;
	equalHeights: boolean = false;
	arrow: boolean = true;
	arrowPosition: string = "right";

	previewTemplate = () => `
        <div class="Xpandy-wrapper">
            ${this.arrow ? '<div class="Xpandy-arrow"></div>' : ""}
            <div class="Xpandy-container">
                <div class="Xpandy-innerContainer">
                    <div class="Xpandy-body">
                        <div class="Xpandy-close--wrapper">
                            <span class="Xpandy-close"></span>
                        </div>
                        <div class="Xpandy-base"></div>
                    </div>
                </div>
            </div>
        </div>
        `;

	callbacks = {
		onInit: (state: object) => {},
		onOpen: (item: HTMLElement, state: object) => {},
		onClose: (item: HTMLElement, state: object) => {},
		onUpdate: (item: HTMLElement, state: object) => {}
	};

	// ------------------------------------------------

	constructor(config: object) {
		Object.assign(this, config);
	}

	register(element: HTMLElement) {
		this.container = element;
	}
}
