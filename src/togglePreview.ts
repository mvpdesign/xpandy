// ------------------------------------------------
// TogglePreview

import StateController from "./state";
import ConfigController from "./config";

import openPreview from "./openPreview";
import closePreview from "./closePreview";
import updatePreview from "./updatePreview";

export default (
	State: StateController,
	Config: ConfigController,
	item: HTMLElement
) => {
	// ------------------------------------------------
	// Case #1
	// There are no activeItems- so we are free to go ahead and open one

	if (!State.activeItems.length) {
		return openPreview(State, Config, item);
	}

	// ------------------------------------------------
	// Case #2
	// The active item is the one clicked on

	const itemIsActive = State.activeItems.some(element => element === item);

	if (itemIsActive) {
		return closePreview(State, Config, item);
	}

	// ------------------------------------------------
	// Case #3
	// A new item is clicked on, and there are activeItems

	// Check to see if any activeItems are on the same row
	// Check to see if more than one preview row can be active at a time

	// The goal is to get an array of items on the same row... there should be either 1 or 0
	const itemOnSameRow = State.activeItems.find(
		(_item: HTMLElement) => _item.offsetTop === item.offsetTop
	);

	// if autoCloseOnOpen we will open or update
	// if not autoCloseOnOpen we will open, close, or update

	// If there are any items on the same row then we can just update it... no need for further checks
	if (itemOnSameRow) {
		return updatePreview(State, Config, item, itemOnSameRow);
	}

	// If you cannot have more than one open item... close all the previews
	if (Config.autoCloseOnOpen) {
		closePreview(State, Config, false, false);
	}

	// If there are no items on the same row we will create a new one
	return openPreview(State, Config, item);
};
