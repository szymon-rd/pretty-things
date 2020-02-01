import React from 'react';
import './App.css';
import { GraphicsRenderer } from './rendering/GraphicsRenderer'

const App: React.FC = () => {
  return (
    <div className="App">
      <GraphicsRenderer> </GraphicsRenderer>
    </div>
  );
}

export default App;
