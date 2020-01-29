# Xpandy

Kinda like Google Images meets an Accordion.

## Get Started

The styles in `style.css` are required to make this work.

### HTML Markup.

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

### Initialize the Javascript.

Update the package import in your project.

```js
import Xpandy from './xpandy';

const xpandy = new Xpandy('.Xpandy', {
    autoCloseOnOpen: true,
    arrow: true,
    arrowPosition: 'right',
    callbacks: {
        onInit: (item, state) => {},
        onOpen: (item, state) => {},
        onClose: (item, state) => {},
        onUpdate: (item, state) => {}
    }
});
```

## Browser Support

-   Supports all modern browsers and IE11.
-   Code base makes use of ES6 features and implements [core-js](https://github.com/zloirock/core-js) to fill in the gaps.

## Contributing

Install packages via `yarn install`

Find a list of outstanding tasks under [this issue](https://github.com/mvpdesign/xpandy/issues/2)

**Build Commands**

| Command | Action                                    |
| ------- | ----------------------------------------- |
| clean   | Removes the `dist/` folder                |
| build   | Compile with `tsc` and bundle with rollup |
| watch   | Rollup watch and compile                  |
