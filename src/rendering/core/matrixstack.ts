import { mat4 } from 'gl-matrix';

export class MatrixStack {
  pointer = 0
  stack: mat4[] = []
  constructor(size: number) {
    for(var i = 0; i < size; i++) {
      this.stack.push(mat4.create())
    }
  }

  push() {
    this.pointer++;
    mat4.copy(this.stack[this.pointer], this.stack[this.pointer - 1])
  }

  pop() {
    this.pointer--;
  }

  mulTop(mat: mat4) {
    mat4.mul(this.stack[this.pointer], this.stack[this.pointer], mat)
  }

  get() {
    return this.stack[this.pointer]
  }
}
