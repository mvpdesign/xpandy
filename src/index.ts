import "core-js/es/array/from";
import "core-js/es/array/find";
import "core-js/es/array/includes";

import "core-js/es/object/assign";

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
