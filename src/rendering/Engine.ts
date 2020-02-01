import { createQuadShape, Shape } from './core/shape';
import { initShaderProgram, ProgramInfo } from './core/shader';
import { vsSource, fsSource, uniforms } from './core/defaultProgram'
import { Component } from './core/component';
import { createDandelion } from './app/dandelion/dandelionModel';

export type GL = WebGL2RenderingContext

export class Engine {
  gl: GL;
  running: boolean = false;
  constructor(ctx: GL) {
    this.gl = ctx;
    this.init()
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

  init = () => {
    const gl = this.gl
    gl.clearColor(1.0, 1.0, 1.0, 1.0);
    this.defaultProgram = initShaderProgram(gl, vsSource, fsSource, uniforms);
    this.rootComponent = createDandelion(gl, 10)
    this.bindProgram(this.defaultProgram as ProgramInfo)
  }

  draw = () => {
    const gl = this.gl;
    gl.clear(gl.COLOR_BUFFER_BIT);
    this.drawComponent(this.rootComponent as Component)

  };

  drawComponent = (component: Component) => {
    const shape = component.shape
    if(shape != null) this.renderShape(component)
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
    gl.uniformMatrix4fv(transformLocation, false, component.transform)
  }

  prepareProgram = (shape: Shape) => {
    if(shape.program == null) {
      this.bindProgram(this.defaultProgram as ProgramInfo)
    } else {
      this.bindProgram(shape.program)
    }
  }

  bindProgram = (program: ProgramInfo) => {
    if(this.currentProgram === program) return;
    this.gl.useProgram(program.program);
    this.currentProgram = program;
  }

}
