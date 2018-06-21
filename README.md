# Xpandy

Kinda like Google Images

---

## Get Started

The styles in `style.css` are required to make this work.

HTML Markup.

```html
<div class="Xpandy">
  ...
   <div class="Xpandy-item">
      <div class="Xpandy-thumbnail"></div>
      <div class="Xpandy-content">
        <!-- This is the stuff in the expanded section -->
      </div>
  </div>
  ...
</div>
```

Initialize the Javascript.

```js
import Xpandy from './xpandy';

const xpandy = new Xpandy('.Xpandy', {
  autoCloseOnOpen: true,
  arrow: true,
  arrowPosition: 'right',
  callbacks: {
    onInit: () => {},
    onOpen: () => {},
    onClose: () => {},
    onUpdate: () => {}
  }
});
```

---

## TODO

* Bundling
* Polyfills
