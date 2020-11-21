import { createProgram, createTexture, QUAD } from "./utils.js";
import * as shaders from "./shaders.js";
const VERTICES_PER_TILE = 6;
export default class Scene {
    constructor(options) {
        this._data = {
            glyph: new Uint16Array(),
            style: new Uint16Array()
        };
        this._buffers = {};
        this._attribs = {};
        this._uniforms = {};
        this._drawRequested = false;
        this._configure(options);
    }
    get node() { return this._gl.canvas; }
    _configure(options) {
        const palette = options.palette || this._palette;
        const isLargePalette = (palette.maxLength > 256);
        this._gl = this._initGL(isLargePalette, options.node);
        const gl = this._gl;
        const uniforms = this._uniforms;
        if (options.tileCount || options.tileSize) { // resize
            const node = this.node;
            let tileSize = options.tileSize || [node.width / this._tileCount[0], node.height / this._tileCount[1]];
            let tileCount = options.tileCount || this._tileCount;
            node.width = tileCount[0] * tileSize[0];
            node.height = tileCount[1] * tileSize[1];
            gl.viewport(0, 0, node.width, node.height);
            gl.uniform2ui(uniforms["viewportSize"], node.width, node.height);
        }
        if (options.tileCount) { // re-create data buffers
            this._tileCount = options.tileCount;
            this._createGeometry(this._tileCount);
            this._createData(this._tileCount[0] * this._tileCount[1], isLargePalette);
        }
        options.tileSize && gl.uniform2uiv(uniforms["tileSize"], options.tileSize);
        options.font && this._uploadFont(options.font);
        this._palette = palette;
        this._palette.scene = this;
    }
    get palette() { return this._palette; }
    draw(position, glyph, fg, bg) {
        let index = position[1] * this._tileCount[0] + position[0];
        index *= VERTICES_PER_TILE;
        this._data.glyph[index + 2] = glyph;
        this._data.glyph[index + 5] = glyph;
        this._data.style[index + 2] = (bg << 16) + fg;
        this._data.style[index + 5] = (bg << 16) + fg;
        this._requestDraw();
    }
    uploadPaletteData(data) {
        const gl = this._gl;
        gl.activeTexture(gl.TEXTURE1);
        gl.bindTexture(gl.TEXTURE_2D, this._textures["palette"]);
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, data);
        this._requestDraw();
    }
    _initGL(isLargePalette = false, node) {
        if (!this._gl) {
            node = node || document.createElement("canvas");
            this._gl = node.getContext("webgl2");
            if (!this._gl) {
                throw new Error("WebGL 2 not supported");
            }
        }
        const gl = this._gl;
        if (this._program) {
            this._gl.deleteProgram(this._program);
        }
        const p = this._program = createProgram(gl, shaders.VS(), shaders.FS(isLargePalette));
        gl.useProgram(p);
        const attributeCount = gl.getProgramParameter(p, gl.ACTIVE_ATTRIBUTES);
        for (let i = 0; i < attributeCount; i++) {
            gl.enableVertexAttribArray(i);
            let info = gl.getActiveAttrib(p, i);
            this._attribs[info.name] = i;
        }
        const uniformCount = gl.getProgramParameter(p, gl.ACTIVE_UNIFORMS);
        for (let i = 0; i < uniformCount; i++) {
            let info = gl.getActiveUniform(p, i);
            this._uniforms[info.name] = gl.getUniformLocation(p, info.name);
        }
        gl.uniform1i(this._uniforms["font"], 0);
        gl.uniform1i(this._uniforms["palette"], 1);
        this._textures = {
            font: createTexture(gl),
            palette: createTexture(gl)
        };
        return gl;
    }
    _createGeometry(size) {
        const gl = this._gl;
        this._buffers.position && gl.deleteBuffer(this._buffers.position);
        this._buffers.uv && gl.deleteBuffer(this._buffers.uv);
        let buffers = createGeometry(gl, this._attribs, size);
        Object.assign(this._buffers, buffers);
    }
    _createData(tileCount, isLargeStyle = false) {
        const gl = this._gl;
        const attribs = this._attribs;
        this._buffers.glyph && gl.deleteBuffer(this._buffers.glyph);
        this._data.glyph = new Uint16Array(tileCount * VERTICES_PER_TILE);
        const glyph = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, glyph);
        gl.vertexAttribIPointer(attribs["glyph"], 1, gl.UNSIGNED_SHORT, 0, 0);
        const aType = isLargeStyle ? Uint32Array : Uint16Array;
        const gType = isLargeStyle ? gl.UNSIGNED_INT : gl.UNSIGNED_SHORT;
        this._buffers.style && gl.deleteBuffer(this._buffers.style);
        this._data.style = new aType(tileCount * VERTICES_PER_TILE);
        const style = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, style);
        gl.vertexAttribIPointer(attribs["style"], 1, gType, 0, 0);
        Object.assign(this._buffers, { glyph, style });
    }
    _requestDraw() {
        if (this._drawRequested) {
            return;
        }
        this._drawRequested = true;
        requestAnimationFrame(() => this._draw());
    }
    _draw() {
        const gl = this._gl;
        this._drawRequested = false;
        gl.bindBuffer(gl.ARRAY_BUFFER, this._buffers.glyph);
        gl.bufferData(gl.ARRAY_BUFFER, this._data.glyph, gl.DYNAMIC_DRAW);
        gl.bindBuffer(gl.ARRAY_BUFFER, this._buffers.style);
        gl.bufferData(gl.ARRAY_BUFFER, this._data.style, gl.DYNAMIC_DRAW);
        gl.drawArrays(gl.TRIANGLES, 0, this._tileCount[0] * this._tileCount[1] * VERTICES_PER_TILE);
        return true;
    }
    _uploadFont(pixels) {
        const gl = this._gl;
        gl.activeTexture(gl.TEXTURE0);
        gl.bindTexture(gl.TEXTURE_2D, this._textures["font"]);
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, pixels);
        this._requestDraw();
    }
}
function createGeometry(gl, attribs, size) {
    let tileCount = size[0] * size[1];
    let positionData = new Uint16Array(tileCount * QUAD.length);
    let uvData = new Uint8Array(tileCount * QUAD.length);
    let i = 0;
    for (let y = 0; y < size[1]; y++) {
        for (let x = 0; x < size[0]; x++) {
            QUAD.forEach(value => {
                positionData[i] = (i % 2 ? y : x) + value;
                uvData[i] = value;
                i++;
            });
        }
    }
    const position = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, position);
    gl.vertexAttribIPointer(attribs["position"], 2, gl.UNSIGNED_SHORT, 0, 0);
    gl.bufferData(gl.ARRAY_BUFFER, positionData, gl.STATIC_DRAW);
    const uv = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, uv);
    gl.vertexAttribIPointer(attribs["uv"], 2, gl.UNSIGNED_BYTE, 0, 0);
    gl.bufferData(gl.ARRAY_BUFFER, uvData, gl.STATIC_DRAW);
    return { position, uv };
}
