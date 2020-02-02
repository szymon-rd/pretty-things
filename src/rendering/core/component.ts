import { Shape } from './shape';
import { mat4 } from 'gl-matrix';
import { UniformData } from './shader';


export interface Component {
  shape: Shape | null
  children: Component[]
  transform: mat4,
  uniformData: UniformData
}

export const newComponent = (
  shape: Shape | null = null,
  transform: mat4 = mat4.create(),
  children: Component[] = [],
  uniformData: UniformData = {}
): Component => ({
  shape,
  children,
  transform,
  uniformData
})

