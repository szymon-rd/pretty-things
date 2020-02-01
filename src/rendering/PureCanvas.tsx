import React, { Component } from 'react';

export interface PureCanvasProps {
  contextRef: Function;
  width: number;
  height: number;
}

export class PureCanvas extends Component<PureCanvasProps, any> {
  shouldComponentUpdate() {
    return false;
  }

  render() {
    return (
      <canvas
        width={this.props.width}
        height={this.props.height}
        ref={node =>
          node ? this.props.contextRef(node.getContext('webgl2')) : null
        }
      />
    );
  }
}
