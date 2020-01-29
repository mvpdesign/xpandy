import StateController from "./state";
import ConfigController from "./config";

import { functionExists } from "./utils";

export default (
	State: StateController,
	Config: ConfigController,
	item: HTMLElement | false = false,
	setState = true
) => {
	// ------------------------------------------------
	// If the state is animating already...
	// Or if there are no active items

	if (State.isAnimating || !State.activeItems.length) return State;
	State.isAnimating = setState;

	// ------------------------------------------------

	// if `el` is set, then just close the preview for that item
	// -> we will have to get the preview that is being used for that row
	// if `el` is not set then we will close all previews
	const itemsToClose = item ? [item] : State.activeItems;

	itemsToClose.forEach(_item => {
		// TODO: offsetTop gives you the distance from the closest relatively positioned parent
		//       it might not cause issues, so i'm leaving it for now, if in the future it does
		//       i will create a getBoundingCLientRect() sort of function to get the real offsetTop
		const previewOnSameRow = State._previewElements.find(
			preview => preview.parentItem.offsetTop === _item.offsetTop
		);

		if (!previewOnSameRow) {
			return;
		}

		// ------------------------------------------------

		if (Config.arrow) {
			let arrow = previewOnSameRow.preview.querySelector(".Xpandy-arrow");

			if (arrow) {
				arrow.classList.remove("Xpandy-arrow--isActive");
			}
		}

		// ------------------------------------------------

		const cleanUpClose = () => {
			State.container.classList.remove("Xpandy--isExpanded");

			previewOnSameRow.preview.removeEventListener(
				"transitionend",
				cleanUpClose,
				false
			);

			// We are all done now, remove isAnimating state
			State.isAnimating = false;

			// This is not supported in IE11
			// Currently a polyfill is being used
			previewOnSameRow.preview.remove();

			if (functionExists(Config.callbacks.onClose)) {
				Config.callbacks.onClose(_item, State);
			}
		};

		// ------------------------------------------------
		// Update preview state classes

		previewOnSameRow.preview.classList.remove("Xpandy-preview--isOpening");
		previewOnSameRow.preview.classList.remove("Xpandy-preview--isUpdating");
		previewOnSameRow.preview.classList.add("Xpandy-preview--isClosing");

		// ------------------------------------------------

		// Set some heights

		const thumbnail = previewOnSameRow.parentItem.querySelector(
			".Xpandy-thumbnail"
		);

		if (thumbnail) {
			// thumbnail.style does not consider inherited/external styles
			// window.getComputedStyle() doesn't work in IE < 9
			const thumbnailComputedStyle: CSSStyleDeclaration = window.getComputedStyle(
				thumbnail
			);

			const marginTop: number = parseInt(thumbnailComputedStyle.marginTop);
			const marginBottom: number = parseInt(
				thumbnailComputedStyle.marginBottom
			);

			// TODO: Find a better way to get margins
			const thumbnailMargins = marginTop + marginBottom;

			// TODO: See if .offsetHeight is a more performant way to get the height
			// Potentially use the Xpandy-item to get the full height
			const thumbnailHeight =
				thumbnail.getBoundingClientRect().height + thumbnailMargins;

			previewOnSameRow.parentItem.style.height = thumbnailHeight + "px";
		}

		previewOnSameRow.preview.style.height = "0px";

		// ------------------------------------------------

		_item.classList.remove("Xpandy-item--isActive");

		previewOnSameRow.preview.addEventListener(
			"transitionend",
			cleanUpClose,
			false
		);
	});

	// End .forEach itemsToClose
	// ------------------------------------------------
	// Cleanup the state

	// If `el` is getting passed into this function
	// then that means we only want to close one item
	// so use .filter() to remove that item from state.activeItems
	// else if `el` is not getting passed in, then close them all
	State.activeItems = item
		? State.activeItems.filter(_item => _item !== item)
		: [];

	// Remove from _previveElements the preview we are closing
	// If there is el we just remove the one... if this is a global close then it doesn't matter
	// and we can dump the whole thing
	// The previewElement may be housed under a different `el` than the one clicked on
	// So we compare offsetTop to see which one to close

	State._previewElements = item
		? State._previewElements.filter(
				_item => _item.parentItem.offsetTop !== item.offsetTop
		  )
		: [];

	return State;
};
