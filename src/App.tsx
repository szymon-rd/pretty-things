import React from 'react';
import './App.css';
import { GraphicsRenderer } from './rendering/GraphicsRenderer'

const App: React.FC = () => {
  return (
    <div className="App">
      <div className="desc">
        <h1></h1>
      </div>
      <GraphicsRenderer> </GraphicsRenderer>

    </div>
  );
}

export default App;
