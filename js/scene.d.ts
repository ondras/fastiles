import Palette from "./palette.js";
declare type Vec2 = [number, number];
export interface Options {
    size: Vec2;
    tileSize: Vec2;
    font: string;
}
export default class Scene {
    private _gl;
    private _size;
    private _palette;
    private _data;
    private _buffers;
    private _textures;
    private _attribs;
    private _uniforms;
    private _drawRequested;
    constructor(options: Options);
    get node(): HTMLCanvasElement;
    setSize(size: Vec2, tileSize: Vec2): void;
    set font(font: string | HTMLImageElement);
    set palette(palette: Palette);
    get palette(): Palette;
    draw(position: Vec2, glyph: number, fg: number, bg: number): void;
    uploadPaletteData(data: HTMLCanvasElement): void;
    private _initGL;
    private _createGeometry;
    private _createData;
    private _requestDraw;
    private _draw;
}
export {};
