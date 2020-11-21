interface Scene {
    uploadPaletteData: (data: HTMLCanvasElement) => void;
}
export default class Palette {
    private _ctx;
    private _length;
    private _maxLength;
    private _scene;
    static default(): Palette;
    static windows16(): Palette;
    static xterm256(): Palette;
    static rexpaint(): Palette;
    static rexpaint8(): Palette;
    static amiga(): Palette;
    static fromArray(data: string[]): Palette;
    constructor(maxLength?: number);
    set scene(scene: Scene | null);
    get length(): number;
    get maxLength(): number;
    set(index: number, color: string): number;
    add(color: string): number;
    clear(): void;
}
export {};
