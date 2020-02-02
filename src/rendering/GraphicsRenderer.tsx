import React, { Component } from 'react';
import { Engine } from './Engine';
import { PureCanvas } from './PureCanvas';

interface GraphicsRendererState {
  engine: Engine | null;
  width: number;
  height: number;
}

export class GraphicsRenderer extends Component<any, GraphicsRendererState> {
  state: GraphicsRendererState = {
    engine: null,
    width: 0,
    height: 0
  };

  componentDidMount() {
    window.addEventListener('resize', this.updateDimensions);
    this.updateDimensions();
  }

  componentWillUnmount() {
    this.state.engine?.stop();
    window.removeEventListener('resize', this.updateDimensions);
  }

  updateDimensions = () => {
    console.log('update!')
    this.setState({ width: window.innerWidth, height: window.innerHeight });
    this.state.engine?.updateProjection(window.innerWidth, window.innerHeight)
  };

  saveContext = (ctx: WebGL2RenderingContext) => {
    this.setState({
      engine: new Engine(ctx, window.innerWidth, window.innerHeight),
    });
  };

  render() {
    this.state.engine?.start();
    return <PureCanvas width={window.innerWidth} height={window.innerHeight} contextRef={this.saveContext} />;
  }

}
