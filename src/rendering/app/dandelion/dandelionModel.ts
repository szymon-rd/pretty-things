import { Component, newComponent } from '../../core/component';
import { GL } from '../../Engine';
import { createShape } from '../../core/shape';
import { mat4, glMatrix } from 'gl-matrix';
import { createSphere } from '../../core/shapes/sphere';
import { createCylinder } from '../../core/shapes/cylinder';
import { randomNormalVector, sphereToCartesian } from '../../core/math';

export const STEM_MODE = 1;
export const HEAD_MODE = 2;
export const SEED_MODE = 3;

const stemHeight = 1;
const stemRadius = 0.01;

const createStem = (gl: GL, segments: number): Component => {
  const stemShape = createCylinder(gl, 10, 9, stemRadius, stemHeight )
  return newComponent(
    stemShape,
    undefined,
    undefined,
    {
      mode: STEM_MODE
    }
  );
}

const headRadius = 0.05;
const createHead = (gl: GL): Component => {
  const headShape = createSphere(gl, 10, 10, headRadius);
  const transform = mat4.create()
  mat4.translate(transform, transform, [0, stemHeight, 0])
  return newComponent(
    headShape,
    transform,
    undefined,
    {
      mode: HEAD_MODE
    }
  )
}

const segmentSeeds = [1, 3, 5, 7, 10, 13, 10, 7, 5, 3, 1 ]
const seedSegmentLength = 0.14;
const seedEndLength = 0.08;
const createSeeds = (gl: GL): Component => {

  var vertices: number[] = [];
  var indices: number[] = [];
  var total = 0;
  for(var i = 0; i < segmentSeeds.length; i++) {
    for(var j = 0; j < segmentSeeds[i]; j++) {
      const headRadiusRef = headRadius - 0.01;
      const theta = (Math.PI / (segmentSeeds.length - 1)) * i;
      const phi = (2*Math.PI / segmentSeeds[i]) * j;
      const v = sphereToCartesian(phi, theta);
      const firstPartDir = sphereToCartesian(phi + 0.7, theta);
      const secondPartDir = sphereToCartesian(phi - 0.7, theta);
      const thirdPartDir = sphereToCartesian(phi + 0.35, theta + 0.35);

      const segmentSeedR = headRadius + seedSegmentLength;

      const seedVertices = [
        v[0] * headRadiusRef, v[1] * headRadiusRef, v[2] * headRadiusRef,
        v[0] * segmentSeedR, v[1] * segmentSeedR, v[2] * segmentSeedR,

        v[0] * segmentSeedR + firstPartDir[0] * seedEndLength,
        v[1] * segmentSeedR + firstPartDir[1] * seedEndLength,
        v[2] * segmentSeedR + firstPartDir[2] * seedEndLength,

        v[0] * segmentSeedR + secondPartDir[0] * seedEndLength,
        v[1] * segmentSeedR + secondPartDir[1] * seedEndLength,
        v[2] * segmentSeedR + secondPartDir[2] * seedEndLength,

        v[0] * segmentSeedR + thirdPartDir[0] * seedEndLength,
        v[1] * segmentSeedR + thirdPartDir[1] * seedEndLength,
        v[2] * segmentSeedR + thirdPartDir[2] * seedEndLength,
      ]

      const baseI = total * 5;
      const seedIndices = [
        baseI, baseI + 1,
        baseI + 1, baseI + 2,
        baseI + 1, baseI + 3,
        baseI + 1, baseI + 4,
      ]

      vertices = vertices.concat(seedVertices);
      indices = indices.concat(seedIndices);
      total++;
    }
  }
  const shape = createShape(
    gl,
    vertices,
    indices,
    gl.LINES,
    null
  )

  const transform = mat4.create();
  mat4.translate(transform, transform, [0, stemHeight, 0])
  return newComponent(
    shape,
    transform,
    undefined,
    {
      mode: SEED_MODE
    }
  )
}

export const createDandelion = (gl: GL): Component => {
  const start = Date.now();
  const stem = createStem(gl, 10)
  const head = createHead(gl)
  const seed = createSeeds(gl)
  const transform = mat4.create()
  mat4.translate(transform, transform, [0, -0.7, -0.5])
  mat4.scale(transform, transform, [1.4, 1.4, 1.4])
  const time = Date.now() - start;
  console.log("Generating dandelion took: " + time + "ms.")
  return newComponent(
    undefined,
    transform,
    [stem, head, seed]
  )
}
