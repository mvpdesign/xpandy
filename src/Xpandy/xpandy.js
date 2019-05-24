// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
// Xpandy 2.0
// usage const expander = new Xpandy('.Xpandy', {});

import configFactory from './config';
import stateFactory from './state';
import { debounce, functionExists } from './utils';

const Xpandy = (container, config) => {
  // ------------------------------------------------
  // Check if Xpandy has already been initialized on this container

  // If a string is getting passed in, we will query for that element
  // If it is anything else we will assume in good faith that it is a Node list
  let elements = typeof container === 'string' ? document.querySelectorAll(container) : container;

  // If no elements are found matching `container`
  if (!elements.length) {
    return false;
  }

  // -------------------------------------------------

  // TODO: Consider scoping the config and state to Xpandy
  const manageConfig = configFactory(config);
  const manageState = stateFactory();

  // ------------------------------------------------
  // TogglePreview

  const togglePreview = obj => {
    let { element, item } = obj;

    const config = manageConfig.getConfig(element);
    const state = manageState.getState(element);

    // ------------------------------------------------
    // Case #1
    // There are no activeItems- so we are free to go ahead and open one
    if (!state.activeItems.length) {
      return openPreview({ element, item });
    }

    // ------------------------------------------------
    // Case #2
    // The active item is the one clicked on

    // Potentially allow for multiple open items... not in the same row
    // TODO: No IE support for Array.includes() Look into use of .some()
    const itemIsActive = state.activeItems.includes(item);

    if (itemIsActive) {
      return closePreview({ element, item });
    }

    // ------------------------------------------------
    // Case #3
    // A new item is clicked on, and there are activeItems

    // Check to see if any activeItems are on the same row
    // Check to see if more than one preview row can be active at a time

    // The goal is to get an array of items on the same row... there should be either 1 or 0
    const itemOnSameRow = state.activeItems.find(_item => _item.offsetTop === item.offsetTop);

    // if autoCloseOnOpen we will open or update
    // if not autoCloseOnOpen we will open, close, or update

    // If there are any items on the same row then we can just update it... no need for further checks
    if (itemOnSameRow) {
      return updatePreview({ element, item, itemOnSameRow });
    }

    // If you cannot have more than one open item... close all the previews
    if (config.autoCloseOnOpen) {
      closePreview({ element }, false);
    }

    // If there are no items on the same row we will create a new one
    return openPreview({ element, item });
  };

  const closePreview = (obj, setState = true) => {
    let { element, item } = obj;

    // Setup
    const config = manageConfig.getConfig(element);
    const state = manageState.getState(element);

    // ------------------------------------------------
    // If the state is animating already...
    // Or if there are no active items

    if (state.isAnimating || !state.activeItems.length) return state;
    state.isAnimating = setState;

    // ------------------------------------------------

    // if `el` is set, then just close the preview for that item
    // -> we will have to get the preview that is being used for that row
    // if `el` is not set then we will close all previews
    const itemsToClose = item ? [item] : state.activeItems;

    itemsToClose.forEach(_item => {
      // TODO: offsetTop gives you the distance from the closest relatively positioned parent
      //       it might not cause issues, so i'm leaving it for now, if in the future it does
      //       i will create a getBoundingCLientRect() sort of function to get the real offsetTop
      const previewOnSameRow = state._previewElements.find(preview => preview.parentItem.offsetTop === _item.offsetTop);

      // ------------------------------------------------

      if (config.arrow) {
        let arrow = previewOnSameRow.preview.querySelector('.Xpandy-arrow');

        arrow.classList.remove('Xpandy-arrow--isActive');
      }

      // ------------------------------------------------

      const cleanUpClose = () => {
        state.container.classList.remove('Xpandy--isExpanded');

        previewOnSameRow.preview.removeEventListener('transitionend', cleanUpClose, false);

        // We are all done now, remove isAnimating state
        state.isAnimating = false;

        // This is not supported in IE11
        // Currently a polyfill is being used
        previewOnSameRow.preview.remove();

        if (functionExists(config.callbacks.onClose)) {
          config.callbacks.onClose(_item, state);
        }
      };

      // ------------------------------------------------
      // Update preview state classes

      previewOnSameRow.preview.classList.remove('Xpandy-preview--isOpening');
      previewOnSameRow.preview.classList.remove('Xpandy-preview--isUpdating');
      previewOnSameRow.preview.classList.add('Xpandy-preview--isClosing');

      // ------------------------------------------------

      // Set some heights

      const thumbnail = previewOnSameRow.parentItem.querySelector('.Xpandy-thumbnail');

      // TODO: Find a better way to get margins
      const thumbnailMargins = parseInt(getComputedStyle(thumbnail)['margin-top']) + parseInt(getComputedStyle(thumbnail)['margin-bottom']);

      // TODO: See if .offsetHeight is a more performant way to get the height
      // Potentially use the Xpandy-item to get the full height
      const thumbnailHeight = thumbnail.getBoundingClientRect().height + thumbnailMargins;

      previewOnSameRow.parentItem.style.height = thumbnailHeight + 'px';
      previewOnSameRow.preview.style.height = '0px';

      // ------------------------------------------------

      _item.classList.remove('Xpandy-item--isActive');

      previewOnSameRow.preview.addEventListener('transitionend', cleanUpClose, false);
    });

    // End .forEach itemsToClose
    // ------------------------------------------------
    // Cleanup the state

    // If `el` is getting passed into this function
    // then that means we only want to close one item
    // so use .filter() to remove that item from state.activeItems
    // else if `el` is not getting passed in, then close them all
    state.activeItems = item ? state.activeItems.filter(_item => _item !== item) : [];

    // Remove from _previveElements the preview we are closing
    // If there is el we just remove the one... if this is a global close then it doesn't matter
    // and we can dump the whole thing
    // The previewElement may be housed under a different `el` than the one clicked on
    // So we compare offsetTop to see which one to close

    state._previewElements = item ? state._previewElements.filter(_item => _item.parentItem.offsetTop !== item.offsetTop) : [];

    return state;
  };

  // ------------------------------------------------

  const openPreview = obj => {
    let { element, item } = obj;

    // ------------------------------------------------
    // Setup

    const state = manageState.getState(element);
    const config = manageConfig.getConfig(element);

    // ------------------------------------------------
    // If the state is animating it means we are in the process of opening an item
    // Bail on future update events until that is done

    if (state.isAnimating) return state;
    state.isAnimating = true;

    // ------------------------------------------------

    // Add the preview item to the el about to be opened
    item.appendChild(state._preview.cloneNode(true));

    // (1) Fetch the preview element itself
    // (2) This is the container of the preview
    // (3) This is the innerContainer of the preview that wraps the body
    // (4) This is the content of the Xpandy-item that is active
    const preview = item.querySelector('.Xpandy-wrapper'); // (1)
    const previewInnerContainer = item.querySelector('.Xpandy-innerContainer'); // (2)
    const previewBase = item.querySelector('.Xpandy-base'); // (3)
    const itemContent = item.querySelector('.Xpandy-content'); // (4)

    // ------------------------------------------------
    // Position the arrow... if we need to

    if (config.arrow) {
      // preview.style.overflow = 'hidden';

      // TODO: MAGIC NUMBERS! This is a random delay to prevent overlap
      //       there has to be a better way to do this
      setTimeout(() => {
        // preview.style.overflow = '';

        const arrow = item.querySelector('.Xpandy-arrow');
        const itemBoundingRect = item.getBoundingClientRect();

        arrow.classList.add('Xpandy-arrow--isActive');

        // This is going to center the arrow under the active item
        const leftOffset = itemBoundingRect.left + itemBoundingRect.width / 2;

        arrow.style.left = leftOffset + 'px';
      }, 125);
    }

    // ------------------------------------------------

    const previewAnimationEnd = () => {
      state.container.classList.add('Xpandy--isExpanded');

      // We are all done now, remove isAnimating state
      state.isAnimating = false;

      preview.removeEventListener('transitionend', previewAnimationEnd, false);
    };

    preview.addEventListener('transitionend', previewAnimationEnd, false);

    // ------------------------------------------------

    previewBase.innerHTML = itemContent.innerHTML;

    const previewHeight = previewInnerContainer.getBoundingClientRect().height;

    const elementHeight = previewHeight + item.clientHeight;

    // Prep the element by setting the existing height
    item.style.height = item.clientHeight + 'px';

    // These are in timeouts because browser become dumb trying to be smart
    // and get the ordering wrong
    setTimeout(() => (preview.style.height = previewHeight + 'px'), 0);
    setTimeout(() => (item.style.height = elementHeight + 'px'), 0);

    preview.classList.add('Xpandy-preview--isOpening');
    item.classList.add('Xpandy-item--isActive');

    // ------------------------------------------------

    // Add the item to the arrow of active `_previewElements`
    state._previewElements.push({
      preview: preview,
      parentItem: item
    });

    // ------------------------------------------------
    // Close X Events

    Array.from(preview.querySelectorAll('.Xpandy-close')).forEach(el => el.addEventListener('click', () => closePreview({ element })));

    // ------------------------------------------------

    state.activeItems.push(item);

    if (functionExists(config.callbacks.onOpen)) {
      config.callbacks.onOpen(item, state);
    }

    return state;
  };

  // ------------------------------------------------

  const updatePreview = obj => {
    let { element, item, itemOnSameRow } = obj;

    const state = manageState.getState(element);
    const config = manageConfig.getConfig(element);

    // ------------------------------------------------
    // If the state is animating it means we are in the process of opening an item
    // Bail on future update events until that is done

    if (state.isAnimating) return state;
    state.isAnimating = true;

    // ------------------------------------------------

    const newContent = item.querySelector('.Xpandy-content');

    const previewOnSameRow = state._previewElements.find(preview => preview.parentItem.offsetTop === item.offsetTop);

    const previewInnerContainer = previewOnSameRow.preview.querySelector('.Xpandy-innerContainer');
    let previewBase = previewOnSameRow.preview.querySelector('.Xpandy-base');

    // ------------------------------------------------
    // Update state.activeItems state by removing current active item
    // and adding the new active item

    state.activeItems = state.activeItems.filter(_item => _item !== itemOnSameRow);
    state.activeItems.push(item);

    // ------------------------------------------------
    // Update preview action classes

    previewOnSameRow.preview.classList.remove('Xpandy-preview--isOpening');
    previewOnSameRow.preview.classList.remove('Xpandy-preview--isUpdating');

    setTimeout(() => previewOnSameRow.preview.classList.add('Xpandy-preview--isUpdating'), 0);

    // ------------------------------------------------

    item.classList.add('Xpandy-item--isActive');
    itemOnSameRow.classList.remove('Xpandy-item--isActive');

    previewBase.innerHTML = newContent.innerHTML;

    // ------------------------------------------------
    // Set and update heights

    const itemThumbnail = item.querySelector('.Xpandy-thumbnail');

    // TODO: Find a better way to get margins
    // Potentially use the Xpandy-item to get the full height
    const thumbnailMargins = parseInt(getComputedStyle(itemThumbnail)['margin-top']) + parseInt(getComputedStyle(itemThumbnail)['margin-bottom']);

    const previewHeight = previewInnerContainer.getBoundingClientRect().height;

    const elementHeight = previewHeight + itemThumbnail.clientHeight + thumbnailMargins;

    previewOnSameRow.preview.style.height = previewHeight + 'px';
    previewOnSameRow.parentItem.style.height = elementHeight + 'px';

    // ------------------------------------------------

    if (config.arrow) {
      const arrow = previewOnSameRow.preview.querySelector('.Xpandy-arrow');
      const itemBoundingRect = item.getBoundingClientRect();

      // This is going to center the arrow under the active item
      const leftOffset = itemBoundingRect.left + itemBoundingRect.width / 2;

      arrow.style.left = leftOffset + 'px';
    }

    state.isAnimating = false;

    if (functionExists(config.callbacks.onUpdate)) {
      config.callbacks.onUpdate(item, state);
    }

    return state;
  };

  // ------------------------------------------------
  // Equal Heights function

  const equalHeights = obj => {
    const { state } = obj;

    let itemHeights = [];

    // https://stackoverflow.com/questions/19669786/check-if-element-is-visible-in-dom
    state.items.map(item => {
      item.style.height = '';
      item.querySelector('.Xpandy-thumbnail').style.height = '';

      if (!itemHeights[item.offsetTop]) {
        itemHeights[item.offsetTop] = [];
      }

      itemHeights[item.offsetTop].push(item.querySelector('.Xpandy-thumbnail'));
    });

    Object.keys(itemHeights).map(key => {
      const maxHeight = itemHeights[key].reduce((height, item) => {
        let itemHeight = item.getBoundingClientRect().height;

        return itemHeight > height ? itemHeight : height;
      }, 0);

      return itemHeights[key].map(item => {
        if (item.style.display == 'none' || maxHeight == 0) return false;

        return (item.style.height = maxHeight + 'px');
      });
    });
  };

  // ------------------------------------------------

  const returnInstanceOrInitialize = element => {
    // And check if an instance exists... and just return it from here
    if (manageState.stateExists(element)) {
      return manageState.getState(element);
    }

    // Fetch the current config instance
    // TODO: test that the config can be updated and
    //       that those changes are reflected in the app
    const config = manageConfig.register(element);
    const state = manageState.register(element);

    state.items = config.items ? Array.from(element.querySelectorAll(config.items)) : Array.from(element.children);

    state._preview = document.createRange().createContextualFragment(config.previewTemplate(config));

    element.classList.add('Xpandy--isActive');

    // ------------------------------------------------
    // Setup the events

    // Click Thumbnail Events
    state.items.forEach(item => {
      // TODO: ERROR_REPORTING... if this doesn't exist
      let thumbnail = item.querySelector('.Xpandy-thumbnail');

      thumbnail.addEventListener('click', () => togglePreview({ element, item }));
    });

    // ------------------------------------------------
    // Window resize events

    // The resize event from the top... it might not be the best way to handle resize events... also IE11
    // We will close the preview on resize... at at later date we can come back to this isssue
    // it would be nice to keep the preview pane open on resize... but that is messy

    let initialWidth = window.outerWidth;

    window.addEventListener(
      'resize',
      debounce(() => {
        if (config.equalHeights) equalHeights({ state });

        if (initialWidth !== window.outerWidth) {
          initialWidth = window.outerWidth;
          return closePreview({ element });
        }
      }, 250)
    );

    // ------------------------------------------------
    // Setup facade handlers

    state.togglePreview = itemSelector => {
      // If no item is given close all previews
      if (!itemSelector) {
        return closePreview({ element });
      }

      let item = typeof itemSelector === 'string' ? document.querySelector(itemSelector) : itemSelector;

      // Use the normal toggle handler
      return togglePreview({ element, item });
    };

    // ------------------------------------------------
    // Set equal heights if it is enabled

    if (config.equalHeights) {
      equalHeights({ state });
    }

    // ------------------------------------------------

    // Trigger callbacks
    if (functionExists(config.callbacks.onInit)) {
      config.callbacks.onInit();
    }

    return state;
  };

  // Return the Xpanders
  return Array.from(elements).map(returnInstanceOrInitialize);
};

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

export default Xpandy;
