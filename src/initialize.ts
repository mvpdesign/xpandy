// ------------------------------------------------
import StateController from "./state";
import ConfigController from "./config";

import togglePreview from "./togglePreview";
import closePreview from "./closePreview";

import { debounce, functionExists, equalHeights } from "./utils";

// TODO: Consider scoping the config and state to Xpandy

export default class Initialize {
  State!: StateController;
  Config!: ConfigController;

  initialWidth = window.outerWidth;

  constructor(State: StateController, Config: ConfigController) {
    this.State = State;
    this.Config = Config;

    // Prepare State by fetching items, setting classes, etc
    this.prepareState();

    // Setup window resize and click events and map to handler functions
    this.prepareEvents();

    // ------------------------------------------------
    // Set equal heights if it is enabled

    if (this.Config.equalHeights) {
      equalHeights(this.State.items);
    }

    // ------------------------------------------------
    // Trigger callbacks

    // The issue at the moment here is that the config includes functions
    // by default, so this will always get called
    // TODO: Fix this

    if (functionExists(this.Config.callbacks.onInit)) {
      this.Config.callbacks.onInit(this.State);
    }
  }

  prepareState() {
    if (this.Config.items) {
      this.State.items = Array.from(
        this.State.container.querySelectorAll<HTMLElement>(this.Config.items)
      );
    } else {
      this.State.items = Array.prototype.slice.call(
        this.State.container.children
      );
    }

    this.State._preview = document
      .createRange()
      .createContextualFragment(this.Config.previewTemplate());

    this.State.container.classList.add("Xpandy--isActive");
  }

  prepareEvents() {
    // ------------------------------------------------
    // Window resize events

    // I'm not super pleased with this solution but don't have time to spend
    // resizing the xpandy pane as the screen size changes.
    // TODO: Make this better

    window.addEventListener(
      "resize",
      debounce(
        () => {
          if (this.initialWidth !== window.outerWidth) {
            if (this.Config.equalHeights) equalHeights(this.State.items);

            this.initialWidth = window.outerWidth;
            return closePreview(this.State, this.Config, false);
          }
        },
        250,
        false
      )
    );

    // ------------------------------------------------
    // Setup "click" events for each item

    this.State.items.forEach(item => {
      const thumbnail = item.querySelector(".Xpandy-thumbnail");

      if (thumbnail) {
        thumbnail.addEventListener("click", () =>
          togglePreview(this.State, this.Config, item)
        );
      }
    });
  }
}
