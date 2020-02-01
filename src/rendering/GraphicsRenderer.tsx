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
    this.setState({ width: window.outerWidth, height: window.outerHeight });
  };

  saveContext = (ctx: WebGL2RenderingContext) => {
    this.setState({
      engine: new Engine(ctx),
    });
  };

  render() {
    console.log(window.outerWidth);
    this.state.engine?.start();
    return <PureCanvas width={window.outerWidth} height={window.outerHeight} contextRef={this.saveContext} />;
  }

}
