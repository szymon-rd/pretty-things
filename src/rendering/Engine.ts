import { createQuadShape, Shape } from './core/shape';
import { initShaderProgram, ProgramInfo } from './core/shader';
import { vsSource, fsSource, uniforms } from './app/dandelion/program'
import { Component } from './core/component';
import { createDandelion } from './app/dandelion/dandelionModel';
import { MatrixStack } from './core/matrixstack';
import { mat4, glMatrix } from 'gl-matrix';
import { Timer } from './core/timer';

export type GL = WebGL2RenderingContext

export class Engine {
  gl: GL;
  running: boolean = false;
  constructor(ctx: GL, width: number, height: number) {
    this.gl = ctx;
    this.init(width, height)
  }

  start = () => {
    this.running = true;
    this.animate();
  }

  stop = () => {
    this.running = false;
  }

  animate = () => {
    this.draw();
    if(this.running) requestAnimationFrame(this.animate)
  }


  defaultProgram: ProgramInfo | null = null
  rootComponent: Component | null = null
  currentProgram: ProgramInfo | null = null
  matrixStack: MatrixStack = new MatrixStack(16)
  projectionMatrix: mat4 = mat4.create();
  cameraMatrix: mat4 = mat4.create();
  lightLocation: number[] = [5, 5, 0];
  headRot: number = -0.13;
  timer = new Timer();

  init = (width: number, height: number) => {
    const gl = this.gl
    gl.clearColor(1.0, 1.0, 1.0, 1.0);
    gl.enable(gl.BLEND);
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA)
    this.defaultProgram = initShaderProgram(gl, vsSource, fsSource, uniforms);
    this.rootComponent = createDandelion(gl);
    this.updateProjection(width, height);
    this.updateCamera();
    this.bindProgram(this.defaultProgram as ProgramInfo)

    document.addEventListener('keydown', this.keyDown);
  }

  keyDown = (k: KeyboardEvent) => {
    console.log(k)
    if(k.key == "ArrowLeft") {
      this.headRot += 0.01;
    } else if(k.key == "ArrowRight") {
      this.headRot -= 0.01;
    }
  }

  updateProjection = (width: number, height: number) => {
    mat4.perspective(
      this.projectionMatrix,
      glMatrix.toRadian(90),
      width / height,
      0.1,
      100
    )
  }

  updateCamera = () => {
    mat4.translate(
      this.cameraMatrix,
      this.cameraMatrix,
      [0.0, -0.3, -1]
    )
  }

  draw = () => {
    const delta = this.timer.tick();
    const gl = this.gl;
    gl.clear(gl.COLOR_BUFFER_BIT);
    //mat4.rotate(this.rootComponent?.transform as mat4, this.rootComponent?.transform as mat4, 0.0003 * delta, [0, 1, 0])
    this.drawComponent(this.rootComponent as Component)
  };

  drawComponent = (component: Component) => {
    const shape = component.shape
    this.matrixStack.push();
    this.matrixStack.mulTop(component.transform);
    if(shape != null) this.renderShape(component)
    for(const child of component.children) {
      this.drawComponent(child);
    }
    this.matrixStack.pop();
    this.bindProgram(null);
  }

  renderShape = (component: Component) => {
    const gl = this.gl;
    const shape = component.shape as Shape
    this.prepareProgram(shape)
    this.prepareUniforms(component)
    gl.bindVertexArray(shape?.vao as number);
    gl.drawElements(shape.mode, shape.indexCount, gl.UNSIGNED_INT, 0)
  }

  prepareUniforms = (component: Component) => {
    const gl = this.gl
    const transformLocation = this.currentProgram?.uniformLocations.modelMatrix as number
    gl.uniformMatrix4fv(transformLocation, false, this.matrixStack.get())
    for(const data in component.uniformData) {
      const location = this.currentProgram?.uniformLocations[data] as WebGLUniformLocation
      gl.uniform1i(location, component.uniformData[data])
    }
  }

  prepareProgram = (shape: Shape) => {
    if(shape.program == null) {
      this.bindProgram(this.defaultProgram as ProgramInfo)
    } else {
      this.bindProgram(shape.program)
    }
  }

  bindProgram = (program: ProgramInfo | null) => {
    const gl = this.gl;
    if(program == null) {
      this.currentProgram = null;
      gl.useProgram(null);
      return;
    }
    if(this.currentProgram === program) return;
    gl.useProgram(program.program);
    gl.uniformMatrix4fv(program.uniformLocations.projectionMatrix, false, this.projectionMatrix);
    gl.uniformMatrix4fv(program.uniformLocations.cameraMatrix, false, this.cameraMatrix);
    gl.uniform1f(program.uniformLocations.headRot, this.headRot);
    this.currentProgram = program;
  }

}
