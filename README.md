# fastiles

Library for rendering colorized bitmap fonts. Very fast, suitable for applications where the whole scene needs frequent redrawing.

## Features

  - Handles bitmap fonts of square and non-square aspect ratios
  - Supports up to 65536 glyphs
  - Updates are batched via `requestAnimationFrame`
  - Color palettes (foreground and background) up to 65536 colors
  - Written in TypeScript

## Speed

  - WebGL (WebGL 2, to be precise)
  - No per-render memory allocations
  - Only one GL draw call for the whole scene
  - Minimized JS data transfer (data set only for [Provoking vertices](https://www.khronos.org/opengl/wiki/Primitive#Provoking_vertex))
  - Thousands of tiles rendered at 60 fps

## Palettes

Glyphs rendered via *fastiles* are using indexed colors. Foreground and background are specified as indices to a current *palette*. A palette can hold up to 65536 colors. There are several predefined palettes and you can create your own. Modifying palette values and switching palettes is very fast.

## Show me the code

```js
import { Scene, Palette } from "./fastiles/fastiles.js";

let options = {
	tileCount: [80, 25],     // tiles
	tileSize: [12, 12],
	font: ...                // image or canvas
}
let scene = new Scene(options)
document.body.appendChild(scene.node)


// basic drawing
scene.draw(
	[0, 0], // position
	64,     // glyph index
	1,      // foreground color index
	0       // background color index
)


// palette change
let newPalette = Palette.xterm256()
scene.palette = newPalette


// adjusting existing palette
newPalette.set(1, "orange")
```

You can load a font dynamically like this:

```js
let font = new Image();
font.src = '<url> | <base 64 data>';
await fond.decode();
```
