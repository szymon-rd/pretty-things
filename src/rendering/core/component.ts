import { Shape } from './shape';
import { mat4 } from 'gl-matrix';

export interface Component {
  shape: Shape | null
  children: Component[]
  transform: mat4
}

export const newComponent = (shape: Shape, transform?: mat4): Component => ({
  shape,
  children: [],
  transform: (transform == null) ? mat4.create() : transform
})

