import { GL } from '../Engine';
import { ProgramInfo } from './shader';

export interface Shape {
  mode: number,
  vao: number,
  indexCount: number,
  program: ProgramInfo | null
}

export const createQuadShape = (gl: GL) => {
  const vertices = [
      -0.6,0.6,0.0,
      -0.6,-0.6,0.0,
      0.6,-0.6,0.0,
      0.6,0.6,0.0
  ];
  const indices = [1,2,3,3,1,0];
  return createShape(gl, vertices, indices, gl.TRIANGLES, null)
}

export const createShape = (
  gl: GL,
  vertices: number[],
  indices: number[],
  mode: number,
  program: ProgramInfo | null
): Shape => {
  console.log(vertices)
  console.log(indices)
  const vao = gl.createVertexArray()
  gl.bindVertexArray(vao)
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, gl.createBuffer());
  gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint32Array(indices), gl.STATIC_DRAW);
  gl.bindBuffer(gl.ARRAY_BUFFER, gl.createBuffer());
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
  gl.enableVertexAttribArray(1);
  gl.vertexAttribPointer(1,3,gl.FLOAT,true,0,0);
  return {
    mode,
    program,
    indexCount: indices.length,
    vao: vao as number
  }
}
