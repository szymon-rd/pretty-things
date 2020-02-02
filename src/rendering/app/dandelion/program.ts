import {HEAD_MODE, STEM_MODE, SEED_MODE} from './dandelionModel'

export const uniforms: string[] = [
  'modelMatrix', 'cameraMatrix', 'projectionMatrix', 'lightLocation', 'mode', 'headRot'
];

export const vsSource = `#version 300 es
  #define M_PI 3.1415926535897932384626433832795
  uniform mat4 projectionMatrix;
  uniform mat4 cameraMatrix;
  uniform mat4 modelMatrix;
  uniform float headRot;
  uniform int mode;
  layout(location = 1) in vec3 vertex;
  layout(location = 2) in vec3 previousVertex;
  out highp vec3 vertexPos;
  flat out int imode;

  vec4 moveStem(vec4 v) {
    float h = vertex.y;
    vec4 moved = vec4(0.0, 0.0, 0.0, 1.0);
    moved.z = v.z;
    moved.x = cos(headRot) * v.x - sin(headRot) * v.y;
    moved.y = sin(headRot) * v.x + cos(headRot) * v.y;
    vec4 interpolated = (1.0-pow(h,4.0)) * v + (pow(h,4.0)) * moved;
    return interpolated;
  }

  vec4 moveHead(vec4 v) {
    vec4 moved = vec4(0.0, 0.0, 0.0, 1.0);
    moved.z = v.z;
    moved.x = cos(headRot) * v.x - sin(headRot) * v.y;
    moved.y = sin(headRot) * v.x + cos(headRot) * v.y;
    return moved;
  }

  void main() {
    imode = mode;
    highp vec4 v4Pos = modelMatrix * vec4(vertex, 1.0);
    highp vec4 transVertex = v4Pos;
    if(mode == ${STEM_MODE}) {
      transVertex = moveStem(transVertex);
    } else if(mode == ${HEAD_MODE} || mode == ${SEED_MODE}) {
      transVertex = moveHead(transVertex);
    }

    vertexPos = transVertex.xyz / transVertex.w;
    gl_Position = projectionMatrix * cameraMatrix * transVertex;
  }
`

export const fsSource = `#version 300 es
  uniform mediump vec3 lightLocation;
  in highp vec3 vertexPos;
  flat in int imode;
  out highp vec4 outColor;

  void main() {
    mediump vec3 color = vec3(0.0, 0.0, 0.0);
    mediump float ambient = 0.3;
    mediump vec3 lightDir = normalize(lightLocation - vertexPos);
    outColor = vec4(0.0, 0.0, 0.0, 1.0);
  }
`
