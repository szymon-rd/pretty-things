import { UniformList } from './shader'

export const uniforms: string[] = [
  'modelMatrix'
];

export const vsSource = `#version 300 es
  uniform mat4 modelMatrix;
  layout(location = 1) in vec3 vertex;
  out highp vec3 vertexPos;
  void main() {
    highp vec4 v4Pos = modelMatrix * vec4(vertex, 1.0);
    vertexPos = v4Pos.xyz / v4Pos.w;
    gl_Position = v4Pos;
  }
`

export const fsSource = `#version 300 es
  in highp vec3 vertexPos;
  out highp vec4 outColor;
  void main() {
    highp vec2 c = gl_PointCoord.xy;

    outColor = vec4(0.0, 0.0, 0.0, 1.0);
  }
`
