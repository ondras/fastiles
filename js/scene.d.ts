import Palette from "./palette.js";
declare type Vec2 = [number, number];
export interface Options {
    tileCount: Vec2;
    tileSize: Vec2;
    font: TexImageSource;
    palette: Palette;
    node?: HTMLCanvasElement;
}
export default class Scene {
    private _gl;
    private _program;
    private _tileCount;
    private _tileSize;
    private _palette;
    private _data;
    private _buffers;
    private _textures;
    private _attribs;
    private _uniforms;
    private _drawRequested;
    constructor(options: Options);
    get node(): HTMLCanvasElement;
    configure(options: Partial<Options>): void;
    get palette(): Palette;
    set palette(value: Palette);
    draw(position: Vec2, glyph: number, fg: number, bg: number): void;
    uploadPaletteData(data: HTMLCanvasElement): void;
    private _initGL;
    private _createGeometry;
    private _createData;
    private _requestDraw;
    private _draw;
    private _uploadFont;
}
export {};
