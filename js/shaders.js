export const VS = `
#version 300 es

in uvec2 position;
in uvec2 uv;
in uint glyph;
in uint fg;
in uint bg;

out vec2 fsUv;
flat out uint fsGlyph;
flat out uint fsFg;
flat out uint fsBg;

uniform highp uvec2 tileSize;
uniform uvec2 viewportSize;

void main() {
	ivec2 positionPx = ivec2(position * tileSize);
	vec2 positionNdc = (vec2(positionPx * 2) / vec2(viewportSize))-1.0;
	positionNdc.y *= -1.0;
	gl_Position = vec4(positionNdc, 0.0, 1.0);

	fsUv = vec2(uv);
	fsGlyph = glyph;
	fsFg = fg;
	fsBg = bg;
}`.trim();
export const FS = `
#version 300 es
precision highp float;

in vec2 fsUv;
flat in uint fsGlyph;
flat in uint fsFg;
flat in uint fsBg;

out vec4 fragColor;
uniform sampler2D font;
uniform sampler2D palette;
uniform highp uvec2 tileSize;

void main() {
	uvec2 fontTiles = uvec2(textureSize(font, 0)) / tileSize;
	uvec2 fontPosition = uvec2(fsGlyph % fontTiles.x, fsGlyph / fontTiles.x);
	uvec2 fontPx = (tileSize * fontPosition) + uvec2(vec2(tileSize) * fsUv);

	vec3 texel = texelFetch(font, ivec2(fontPx), 0).rgb;
	vec3 fg = texelFetch(palette, ivec2(fsFg, 0), 0).rgb;
	vec3 bg = texelFetch(palette, ivec2(fsBg, 0), 0).rgb;

	fragColor = vec4(mix(bg, fg, texel), 1.0);
}`.trim();
