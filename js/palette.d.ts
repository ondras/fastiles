interface Scene {
    uploadPaletteData: (data: HTMLCanvasElement) => void;
}
export default class Palette {
    private _ctx;
    private _length;
    private _scene;
    static default(): Palette;
    static windows16(): Palette;
    static xterm256(): Palette;
    static fromArray(data: string[]): Palette;
    constructor();
    set scene(scene: Scene | null);
    get length(): number;
    set(index: number, color: string): number;
    add(color: string): number;
    clear(): void;
}
export {};
