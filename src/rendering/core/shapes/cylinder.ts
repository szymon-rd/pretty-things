import { Shape, createShape } from '../shape';
import { GL } from '../../Engine';

export const createCylinder = (
  gl: GL,
  segments: number,
  vertSegments: number,
  radius: number,
  height: number
): Shape => {
  const segmentHeight = height / segments;
  var vertices: number[] = [];
  var indices: number[] = [];
  for(var i=0; i <= segments; i++) {
    for(var j = 0; j < vertSegments; j++) {
      const phi = ((Math.PI * 2) / vertSegments) * j;
      vertices = vertices.concat([
        Math.cos(phi) * radius, i * segmentHeight, Math.sin(phi) * radius
      ]);

      if(i != segments) {
        const rightDown = vertSegments * i + j;
        const rightUp = (vertSegments * (i + 1)) + j;
        const leftDown = (j == vertSegments - 1) ? vertSegments * i : vertSegments * i + j + 1;
        const leftUp = (j == vertSegments - 1) ?  vertSegments * (i + 1) : vertSegments * (i + 1) + j + 1;
        indices = indices.concat([
          leftDown, rightUp, rightDown,
          leftUp, rightUp, leftDown
        ])
      }
    }
  }
  return createShape(
    gl,
    vertices,
    indices,
    gl.TRIANGLES,
    null
  );
}
