// import "core-js/fn/array/from";
// import "core-js/fn/array/find";
// import "core-js/fn/array/includes";

// import "core-js/fn/object/assign";

// Pull in DOM polyfills since core-js focuses on ECMAScript features
import "./polyfills";

import StateController from "./state";
import ConfigController from "./config";

import Initialize from "./initialize";

export default class Xpandy {
	constructor(container: string, config: object) {
		Array.from(document.querySelectorAll<HTMLElement>(container)).map(
			element => {
				const State = new StateController(element);
				const Config = new ConfigController(config);

				return new Initialize(State, Config);
			}
		);
	}
}
