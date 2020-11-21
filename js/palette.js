export default class Palette {
    constructor(maxLength = 256) {
        this._length = 0;
        this._maxLength = 0;
        this._scene = null;
        let canvas = document.createElement("canvas");
        canvas.width = 256;
        canvas.height = ((maxLength - 1) >> 8) + 1;
        this._ctx = canvas.getContext("2d");
        this._length = 0;
        this._maxLength = maxLength;
    }
    static default() { return this.fromArray(["black", "white"]); }
    static windows16() { return this.fromArray(WINDOWS_16); }
    static xterm256() { return this.fromArray(XTERM_256); }
    static rexpaint() { return this.fromArray(REXPAINT); }
    static rexpaint8() { return this.fromArray(REXPAINT_8); }
    static amiga() { return this.fromArray(AMIGA); }
    static fromArray(data) {
        let p = new this(data.length);
        data.forEach(c => p.add(c));
        return p;
    }
    set scene(scene) {
        this._scene = scene;
        scene && scene.uploadPaletteData(this._ctx.canvas);
    }
    get length() { return this._length; }
    get maxLength() { return this._maxLength; }
    get isLarge() { return this._maxLength > 256; }
    arrayType() { return (this.isLarge) ? Uint32Array : Uint16Array; }
    glType(gl) { return (this.isLarge) ? gl.UNSIGNED_INT : gl.UNSIGNED_SHORT; }
    set(index, color) {
        const ctx = this._ctx;
        ctx.fillStyle = color;
        ctx.fillRect(index % 256, index >> 8, 1, 1);
        this._scene && this._scene.uploadPaletteData(ctx.canvas);
        return index;
    }
    add(color) { return this.set(this._length++, color); }
    clear() {
        const ctx = this._ctx;
        ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
        this._length = 0;
    }
}
const WINDOWS_16 = ["black", "gray", "maroon", "red", "green", "lime", "olive", "yellow", "navy", "blue", "purple", "fuchsia", "teal", "aqua", "silver", "white"];
const XTERM_256 = ["#000000", "#800000", "#008000", "#808000", "#000080", "#800080", "#008080", "#c0c0c0", "#808080", "#ff0000", "#00ff00", "#ffff00", "#0000ff", "#ff00ff", "#00ffff", "#ffffff", "#000000", "#00005f", "#000087", "#0000af", "#0000d7", "#0000ff", "#005f00", "#005f5f", "#005f87", "#005faf", "#005fd7", "#005fff", "#008700", "#00875f", "#008787", "#0087af", "#0087d7", "#0087ff", "#00af00", "#00af5f", "#00af87", "#00afaf", "#00afd7", "#00afff", "#00d700", "#00d75f", "#00d787", "#00d7af", "#00d7d7", "#00d7ff", "#00ff00", "#00ff5f", "#00ff87", "#00ffaf", "#00ffd7", "#00ffff", "#5f0000", "#5f005f", "#5f0087", "#5f00af", "#5f00d7", "#5f00ff", "#5f5f00", "#5f5f5f", "#5f5f87", "#5f5faf", "#5f5fd7", "#5f5fff", "#5f8700", "#5f875f", "#5f8787", "#5f87af", "#5f87d7", "#5f87ff", "#5faf00", "#5faf5f", "#5faf87", "#5fafaf", "#5fafd7", "#5fafff", "#5fd700", "#5fd75f", "#5fd787", "#5fd7af", "#5fd7d7", "#5fd7ff", "#5fff00", "#5fff5f", "#5fff87", "#5fffaf", "#5fffd7", "#5fffff", "#870000", "#87005f", "#870087", "#8700af", "#8700d7", "#8700ff", "#875f00", "#875f5f", "#875f87", "#875faf", "#875fd7", "#875fff", "#878700", "#87875f", "#878787", "#8787af", "#8787d7", "#8787ff", "#87af00", "#87af5f", "#87af87", "#87afaf", "#87afd7", "#87afff", "#87d700", "#87d75f", "#87d787", "#87d7af", "#87d7d7", "#87d7ff", "#87ff00", "#87ff5f", "#87ff87", "#87ffaf", "#87ffd7", "#87ffff", "#af0000", "#af005f", "#af0087", "#af00af", "#af00d7", "#af00ff", "#af5f00", "#af5f5f", "#af5f87", "#af5faf", "#af5fd7", "#af5fff", "#af8700", "#af875f", "#af8787", "#af87af", "#af87d7", "#af87ff", "#afaf00", "#afaf5f", "#afaf87", "#afafaf", "#afafd7", "#afafff", "#afd700", "#afd75f", "#afd787", "#afd7af", "#afd7d7", "#afd7ff", "#afff00", "#afff5f", "#afff87", "#afffaf", "#afffd7", "#afffff", "#d70000", "#d7005f", "#d70087", "#d700af", "#d700d7", "#d700ff", "#d75f00", "#d75f5f", "#d75f87", "#d75faf", "#d75fd7", "#d75fff", "#d78700", "#d7875f", "#d78787", "#d787af", "#d787d7", "#d787ff", "#d7af00", "#d7af5f", "#d7af87", "#d7afaf", "#d7afd7", "#d7afff", "#d7d700", "#d7d75f", "#d7d787", "#d7d7af", "#d7d7d7", "#d7d7ff", "#d7ff00", "#d7ff5f", "#d7ff87", "#d7ffaf", "#d7ffd7", "#d7ffff", "#ff0000", "#ff005f", "#ff0087", "#ff00af", "#ff00d7", "#ff00ff", "#ff5f00", "#ff5f5f", "#ff5f87", "#ff5faf", "#ff5fd7", "#ff5fff", "#ff8700", "#ff875f", "#ff8787", "#ff87af", "#ff87d7", "#ff87ff", "#ffaf00", "#ffaf5f", "#ffaf87", "#ffafaf", "#ffafd7", "#ffafff", "#ffd700", "#ffd75f", "#ffd787", "#ffd7af", "#ffd7d7", "#ffd7ff", "#ffff00", "#ffff5f", "#ffff87", "#ffffaf", "#ffffd7", "#ffffff", "#080808", "#121212", "#1c1c1c", "#262626", "#303030", "#3a3a3a", "#444444", "#4e4e4e", "#585858", "#626262", "#6c6c6c", "#767676", "#808080", "#8a8a8a", "#949494", "#9e9e9e", "#a8a8a8", "#b2b2b2", "#bcbcbc", "#c6c6c6", "#d0d0d0", "#dadada", "#e4e4e4", "#eeeeee"];
const REXPAINT = [
    [64, 0, 0], [102, 0, 0], [140, 0, 0], [178, 0, 0], [217, 0, 0], [255, 0, 0], [255, 51, 51], [255, 102, 102], [0, 32, 64], [0, 51, 102], [0, 70, 140], [0, 89, 178], [0, 108, 217], [0, 128, 255], [51, 153, 255], [102, 178, 255],
    [64, 16, 0], [102, 26, 0], [140, 35, 0], [178, 45, 0], [217, 54, 0], [255, 64, 0], [255, 102, 51], [255, 140, 102], [0, 0, 64], [0, 0, 102], [0, 0, 140], [0, 0, 178], [0, 0, 217], [0, 0, 255], [51, 51, 255], [102, 102, 255],
    [64, 32, 0], [102, 51, 0], [140, 70, 0], [178, 89, 0], [217, 108, 0], [255, 128, 0], [255, 153, 51], [255, 178, 102], [16, 0, 64], [26, 0, 102], [35, 0, 140], [45, 0, 178], [54, 0, 217], [64, 0, 255], [102, 51, 255], [140, 102, 255],
    [64, 48, 0], [102, 77, 0], [140, 105, 0], [178, 134, 0], [217, 163, 0], [255, 191, 0], [255, 204, 51], [255, 217, 102], [32, 0, 64], [51, 0, 102], [70, 0, 140], [89, 0, 178], [108, 0, 217], [128, 0, 255], [153, 51, 255], [178, 102, 255],
    [64, 64, 0], [102, 102, 0], [140, 140, 0], [178, 178, 0], [217, 217, 0], [255, 255, 0], [255, 255, 51], [255, 255, 102], [48, 0, 64], [77, 0, 102], [105, 0, 140], [134, 0, 178], [163, 0, 217], [191, 0, 255], [204, 51, 255], [217, 102, 255],
    [48, 64, 0], [77, 102, 0], [105, 140, 0], [134, 178, 0], [163, 217, 0], [191, 255, 0], [204, 255, 51], [217, 255, 102], [64, 0, 64], [102, 0, 102], [140, 0, 140], [178, 0, 178], [217, 0, 217], [255, 0, 255], [255, 51, 255], [255, 102, 255],
    [32, 64, 0], [51, 102, 0], [70, 140, 0], [89, 178, 0], [108, 217, 0], [128, 255, 0], [153, 255, 51], [178, 255, 102], [64, 0, 48], [102, 0, 77], [140, 0, 105], [178, 0, 134], [217, 0, 163], [255, 0, 191], [255, 51, 204], [255, 102, 217],
    [0, 64, 0], [0, 102, 0], [0, 140, 0], [0, 178, 0], [0, 217, 0], [0, 255, 0], [51, 255, 51], [102, 255, 102], [64, 0, 32], [102, 0, 51], [140, 0, 70], [178, 0, 89], [217, 0, 108], [255, 0, 128], [255, 51, 153], [255, 102, 178],
    [0, 64, 32], [0, 102, 51], [0, 140, 70], [0, 178, 89], [0, 217, 108], [0, 255, 128], [51, 255, 153], [102, 255, 178], [64, 0, 16], [102, 0, 26], [140, 0, 35], [178, 0, 45], [217, 0, 54], [255, 0, 64], [255, 51, 102], [255, 102, 140],
    [0, 64, 48], [0, 102, 77], [0, 140, 105], [0, 178, 134], [0, 217, 163], [0, 255, 191], [51, 255, 204], [102, 255, 217], [26, 26, 26], [51, 51, 51], [77, 77, 77], [102, 102, 102], [128, 128, 128], [158, 158, 158], [191, 191, 191], [222, 222, 222],
    [0, 64, 64], [0, 102, 102], [0, 140, 140], [0, 178, 178], [0, 217, 217], [0, 255, 255], [51, 255, 255], [102, 255, 255], [26, 20, 13], [51, 41, 26], [77, 61, 38], [102, 82, 51], [128, 102, 64], [158, 134, 100], [191, 171, 143], [222, 211, 195],
    [0, 48, 64], [0, 77, 102], [0, 105, 140], [0, 134, 178], [0, 163, 217], [0, 191, 255], [51, 204, 255], [102, 217, 255], [0, 0, 0], [0, 0, 0], [0, 0, 0], [0, 0, 0], [255, 255, 255], [255, 255, 255], [255, 255, 255], [255, 255, 255],
].map(color => `rgb(${color.join(",")})`);
const REXPAINT_8 = REXPAINT.map((_, index, all) => {
    let remainder = index % 8;
    let set = index >> 3;
    set = (index < 96 ? 2 * set : (set - 12) * 2 + 1);
    return all[8 * set + remainder];
});
const AMIGA = new Array(4096).fill(0).map((_, i) => {
    const r = (i % 16);
    const g = (i >> 4) % 16;
    const b = (i >> 8);
    const color = [r * 17, g * 17, b * 17].join(',');
    return `rgb(${color})`;
});
