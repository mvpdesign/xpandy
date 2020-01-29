// ------------------------------------------------

import StateController from "./state";
import ConfigController from "./config";

import { functionExists } from "./utils";

export default (
	State: StateController,
	Config: ConfigController,
	item: HTMLElement,
	itemOnSameRow: HTMLElement
) => {
	// ------------------------------------------------
	// If the state is animating it means we are in the process of opening an item
	// Bail on future update events until that is done

	if (State.isAnimating) return State;
	State.isAnimating = true;

	// ------------------------------------------------

	const newContent = item.querySelector(".Xpandy-content");

	const previewOnSameRow = State._previewElements.find(
		preview => preview.parentItem.offsetTop === item.offsetTop
	);

	if (!previewOnSameRow) {
		State.isAnimating = false;
		return State;
	}

	const previewInnerContainer = previewOnSameRow.preview.querySelector(
		".Xpandy-innerContainer"
	);
	let previewBase = previewOnSameRow.preview.querySelector(".Xpandy-base");

	// ------------------------------------------------
	// Update state.activeItems state by removing current active item
	// and adding the new active item

	State.activeItems = State.activeItems.filter(
		_item => _item !== itemOnSameRow
	);

	State.activeItems.push(item);

	// ------------------------------------------------
	// Update preview action classes

	previewOnSameRow.preview.classList.remove("Xpandy-preview--isOpening");
	previewOnSameRow.preview.classList.remove("Xpandy-preview--isUpdating");

	setTimeout(
		() => previewOnSameRow.preview.classList.add("Xpandy-preview--isUpdating"),
		0
	);

	// ------------------------------------------------

	item.classList.add("Xpandy-item--isActive");
	itemOnSameRow.classList.remove("Xpandy-item--isActive");

	if (newContent && previewBase) {
		previewBase.innerHTML = newContent.innerHTML;
	}

	// ------------------------------------------------
	// Set and update heights

	const itemThumbnail = item.querySelector(".Xpandy-thumbnail");

	if (itemThumbnail) {
		// TODO: Find a better way to get margins
		// Potentially use the Xpandy-item to get the full height
		const thumbnailMargins =
			parseInt(window.getComputedStyle(itemThumbnail).marginTop) +
			parseInt(window.getComputedStyle(itemThumbnail).marginBottom);

		const previewHeight = previewInnerContainer
			? previewInnerContainer.getBoundingClientRect().height
			: 0;

		const elementHeight =
			previewHeight + itemThumbnail.clientHeight + thumbnailMargins;

		previewOnSameRow.preview.style.height = previewHeight + "px";
		previewOnSameRow.parentItem.style.height = elementHeight + "px";
	}

	// ------------------------------------------------

	if (Config.arrow) {
		const arrow = previewOnSameRow.preview.querySelector<HTMLElement>(
			".Xpandy-arrow"
		);

		if (arrow) {
			const itemBoundingRect = item.getBoundingClientRect();

			// This is going to center the arrow under the active item
			const leftOffset = itemBoundingRect.left + itemBoundingRect.width / 2;

			arrow.style.left = leftOffset + "px";
		}
	}

	State.isAnimating = false;

	if (functionExists(Config.callbacks.onUpdate)) {
		Config.callbacks.onUpdate(item, State);
	}

	return State;
};
