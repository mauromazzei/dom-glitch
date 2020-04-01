# Dom Glitch

A p5 based library that apply a glitch effect to DOM images based on this pen (https://codepen.io/tksiiii/pen/xdQgJX)

## Packaged Builds

In your `head` tag, include the following code:

```html
<script type="text/javascript" src="build/domglitch.js"></script>
```

## Installing from npm

```bash
$ npm i dom-glitch
```

```js
// ES6:
import Glitch from '../modules/Glitch'
let glitch = new Glitch()
glitch.glitch({
  $dom, // (DOM element to use as a wrapper),
  src // (IMG path to use as wrapper)
})
```

## Directory Contents

```
├── build - Compiled source code.
└── src - Source files.
```

## Thanks

The following libraries / open-source projects were used in the development of dat.GUI:

- [p5js](https://p5js.org/)
- [Takashi](https://codepen.io/tksiiii/pen/xdQgJX)
- [ciffi-js](https://github.com/ciffi/ciffi-js)

## Next steps

- [ ] Examples
- [ ] Better Documentation
- [ ] Test & Debug
