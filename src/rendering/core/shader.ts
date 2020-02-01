import * as R from 'ramda';
import { GL } from '../Engine';


export type UniformList = {
  [name: string]: WebGLUniformLocation
}

export interface ProgramInfo {
  program: WebGLProgram,
  attribLocations: {
    vertexPosition: number,
  }
  uniformLocations: UniformList
}

export const initShaderProgram = (
  gl: GL,
  vsSource: string,
  fsSource: string,
  uniforms: string[]
): ProgramInfo | null => {
  console.log('init')
  const vertexShader = loadShader(gl, gl.VERTEX_SHADER, vsSource) as WebGLShader;
  const fragmentShader = loadShader(gl, gl.FRAGMENT_SHADER, fsSource) as WebGLShader;
  const shaderProgram = gl.createProgram() as WebGLProgram;
  gl.attachShader(shaderProgram, vertexShader);
  gl.attachShader(shaderProgram, fragmentShader);
  gl.linkProgram(shaderProgram);
  if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
    console.error('Unable to initialize the shader program: ' + gl.getProgramInfoLog(shaderProgram));
    return null;
  }
  return {
    program: shaderProgram,
    attribLocations: {
      vertexPosition: gl.getAttribLocation(shaderProgram, 'vertex') as number
    },
    uniformLocations: R.reduce(R.merge, {} as any, R.map(
      uniform => ({[uniform]: gl.getUniformLocation(shaderProgram, uniform)}),
      uniforms
    ))
  } as ProgramInfo;
}

export const loadShader = (gl: WebGLRenderingContext, type: number, source: string) => {
  const shader = gl.createShader(type) as WebGLShader;
  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    console.error('An error occurred compiling the shaders: ' + gl.getShaderInfoLog(shader));
    gl.deleteShader(shader);
    return null;
  }
  return shader;
}

export const worldProgramUniforms = [
  'modelViewMatrix',
  'projectionMatrix'
]

export const initWorldProgram = (
  gl: GL,
  vsSource: string,
  fsSource: string,
  extraUniforms: string[]
): ProgramInfo | null => initShaderProgram(
  gl,
  vsSource,
  fsSource,
  R.concat(worldProgramUniforms, extraUniforms)
)
