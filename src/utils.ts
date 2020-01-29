import { equalHeightsInfo } from "./interfaces";

type Procedure = (...args: any[]) => void;

export const debounce = function<F extends Procedure>(
	func: F,
	wait: number = 50,
	immediate: boolean = false
) {
	let timeoutId: ReturnType<typeof setTimeout> | undefined;

	return function(this: any, ...args: any[]) {
		const context = this;

		const todoLater = function() {
			timeoutId = undefined;

			if (!immediate) {
				func.apply(context, args);
			}
		};

		if (timeoutId !== undefined) {
			clearTimeout(timeoutId);
		}

		timeoutId = setTimeout(todoLater, wait);

		if (immediate && timeoutId === undefined) {
			func.apply(context, args);
		}
	} as any;
};

export const functionExists = (func: Function) => typeof func === "function";

// ------------------------------------------------
// Equal Heights function

export const equalHeights = (items: HTMLElement[]) => {
	const organizeRows = items.reduce(
		(rows: equalHeightsInfo[], item: HTMLElement) => {
			const thumbnail = item.querySelector<HTMLElement>(".Xpandy-thumbnail");

			if (!thumbnail) {
				return rows;
			}

			// Remove heights for correct calculations
			item.style.height = "";
			thumbnail.style.height = "";

			const thumbOffset = thumbnail.offsetTop;
			const row = rows.find(r => r.rowOffset === thumbOffset);

			if (!row) {
				// Setting tallest to 0 is a work around. Because of the way JS
				// works we can't get the correct height in the same scope as when
				// we remove the heights from item and thumbnail
				// TODO: Refactor this whole function

				rows.push({
					rowOffset: thumbOffset,
					tallest: 0,
					items: [thumbnail]
				});

				return rows;
			}

			row.items.push(thumbnail);

			return rows;
		},
		<equalHeightsInfo[]>[]
	);

	const rowsWithMaxHeights = organizeRows.map(row => {
		row.tallest = row.items.reduce((maxHeight, item) => {
			const height = item.getBoundingClientRect().height;
			return height > maxHeight ? height : maxHeight;
		}, 0);

		return row;
	});

	rowsWithMaxHeights.forEach((row: equalHeightsInfo) => {
		const maxHeight = row.tallest;

		return row.items.forEach(thumbnail => {
			if (thumbnail.style.display === "none" || maxHeight === 0) {
				return;
			}

			thumbnail.style.height = maxHeight + "px";
		});
	});
};
