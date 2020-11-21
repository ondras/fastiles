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

By default palettes can hold 256 colors.  This optimizes the memory sent to the graphics card and should lead to the absolute fastest performance.  If you need more than 256 colors, then you can create a palette with a larger maximum size.  Do this by passing in the maximum size in the constructor.  

The sizes of palettes varies by units of 256, so a palette created with a size of 50 is the same as a palette created with a size of 256.  Both palettes will use 16 bit data to transfer color information to the GPU (8 bits for foreground, 8 bits for background).  Palettes with maximum sizes larger than 256 will use 32 bits for color information.

The maximum size of a palette is 65536.

```js
const p = new Palette();  // max = 256
p.maxLength === 256;

const p2 = new Palette(4000);
p2.maxLength === 4096;  // 4000 rounded up to next multiple of 256
```

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
