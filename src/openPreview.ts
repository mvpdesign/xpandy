// ------------------------------------------------

import StateController from "./state";
import ConfigController from "./config";

import closePreview from "./closePreview";

import { functionExists } from "./utils";

export default (
	State: StateController,
	Config: ConfigController,
	item: HTMLElement
) => {
	// ------------------------------------------------
	// If the state is animating it means we are in the process of opening an item
	// Bail on future update events until that is done

	if (State.isAnimating) return State;
	State.isAnimating = true;

	// ------------------------------------------------

	// Add the preview item to the el about to be opened
	item.appendChild(State._preview.cloneNode(true));

	// (1) Fetch the preview element itself
	// (2) This is the container of the preview
	// (3) This is the innerContainer of the preview that wraps the body
	// (4) This is the content of the Xpandy-item that is active
	const preview: HTMLElement | null = item.querySelector(".Xpandy-wrapper"); // (1)
	const previewInnerContainer = item.querySelector(".Xpandy-innerContainer"); // (2)
	const previewBase = item.querySelector(".Xpandy-base"); // (3)
	const itemContent = item.querySelector(".Xpandy-content"); // (4)

	if (!preview || !previewInnerContainer || !previewBase || !itemContent) {
		return State;
	}

	// ------------------------------------------------
	// Position the arrow... if we need to

	if (Config.arrow) {
		// preview.style.overflow = 'hidden';

		// TODO: MAGIC NUMBERS! This is a random delay to prevent overlap
		//       there has to be a better way to do this
		setTimeout(() => {
			// preview.style.overflow = '';

			const arrow: HTMLElement | null = item.querySelector(".Xpandy-arrow");
			const itemBoundingRect = item.getBoundingClientRect();

			const leftOffset = itemBoundingRect.left + itemBoundingRect.width / 2;

			if (arrow) {
				arrow.classList.add("Xpandy-arrow--isActive");

				// This is going to center the arrow under the active item
				arrow.style.left = leftOffset + "px";
			}
		}, 125);
	}

	// ------------------------------------------------

	const previewAnimationEnd = () => {
		State.container.classList.add("Xpandy--isExpanded");

		// We are all done now, remove isAnimating state
		State.isAnimating = false;

		preview.removeEventListener("transitionend", previewAnimationEnd, false);
	};

	preview.addEventListener("transitionend", previewAnimationEnd, false);

	// ------------------------------------------------

	previewBase.innerHTML = itemContent.innerHTML;

	const previewHeight = previewInnerContainer.getBoundingClientRect().height;

	const elementHeight = previewHeight + item.clientHeight;

	// Prep the element by setting the existing height
	item.style.height = item.clientHeight + "px";

	// These are in timeouts because browser become dumb trying to be smart
	// and get the ordering wrong
	setTimeout(() => (preview.style.height = previewHeight + "px"), 0);
	setTimeout(() => (item.style.height = elementHeight + "px"), 0);

	preview.classList.add("Xpandy-preview--isOpening");
	item.classList.add("Xpandy-item--isActive");

	// ------------------------------------------------

	// Add the item to the arrow of active `_previewElements`
	State._previewElements.push({
		preview: preview,
		parentItem: item
	});

	// ------------------------------------------------
	// Close X Events

	Array.from(preview.querySelectorAll(".Xpandy-close")).forEach(el =>
		el.addEventListener("click", () => closePreview(State, Config, false))
	);

	// ------------------------------------------------

	State.activeItems.push(item);

	if (functionExists(Config.callbacks.onOpen)) {
		Config.callbacks.onOpen(item, State);
	}

	return State;
};
