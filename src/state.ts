import { previewElementObject } from "./interfaces";

export default class State {
	container!: HTMLElement;
	items: HTMLElement[] = [];
	activeItems: HTMLElement[] = [];
	isAnimating = false;

	_preview!: DocumentFragment;
	_previewElements: previewElementObject[] = [];

	togglePreview!: Function;

	statesArray!: [];

	constructor(element: HTMLElement) {
		this.container = element;
	}
}
