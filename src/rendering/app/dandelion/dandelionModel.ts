import { Component, newComponent } from '../../core/component';
import { GL } from '../../Engine';
import { createShape } from '../../core/shape';
import { mat3, mat4 } from 'gl-matrix';

const stemHeight = 1;
const stemWidth = 0.007;
export const verticesStem = (segments: number): number[] => {
  const segmentHeight = stemHeight / segments;
  const halfStemWidth = stemWidth / 2.0;
  var vertices: number[] = [];
  for(var i=0; i <= segments; i++){
    vertices = vertices.concat([
        -halfStemWidth, i * segmentHeight, 0.0,
        halfStemWidth, i * segmentHeight, 0.0
    ]);
  }
  return vertices;
}

export const indicesStem = (segments: number): number[] => {
  var indices: number[] = [];
  for(var i=0; i < segments; i++) {
    const cornerIndex = i * 2;
    indices = indices.concat([
      cornerIndex, cornerIndex + 1, cornerIndex + 2,
      cornerIndex + 1, cornerIndex + 3, cornerIndex + 2
    ]);
  }
  return indices;
}

export const createDandelion = (gl: GL, segments: number): Component => {
  const stemShape = createShape(
    gl,
    verticesStem(segments),
    indicesStem(segments),
    gl.LINE_STRIP,
    null
  )
  const stemTransform = mat4.create()
  mat4.translate(stemTransform, stemTransform, [0, -0.5, -0.5])
  mat4.scale(stemTransform, stemTransform, [0.7, 0.7, 0.7])
  return newComponent(stemShape, stemTransform);
}
