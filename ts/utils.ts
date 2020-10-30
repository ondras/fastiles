type GL = WebGL2RenderingContext;

export const QUAD = [
	0, 0, 1, 0, 0, 1,
	0, 1, 1, 0, 1, 1
];

export function createProgram(gl: GL, ...sources: string[]) {
	const p = gl.createProgram() as WebGLProgram;

	[gl.VERTEX_SHADER, gl.FRAGMENT_SHADER].forEach((type, index) => {
		const shader = gl.createShader(type) as WebGLShader;
		gl.shaderSource(shader, sources[index]);
		gl.compileShader(shader);
		if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) { throw new Error(gl.getShaderInfoLog(shader) as string); }
		gl.attachShader(p, shader);
	});

	gl.linkProgram(p);
	if (!gl.getProgramParameter(p, gl.LINK_STATUS)) { throw new Error(gl.getProgramInfoLog(p) as string); }

	return p;
}

export function createTexture(gl: GL) {
	let t = gl.createTexture() as WebGLTexture;
	gl.bindTexture(gl.TEXTURE_2D, t);
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
	return t;
}
