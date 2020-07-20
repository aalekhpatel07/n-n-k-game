import React from 'react';
import TicTacToe from './components/TicTacToe.component';
import './stylesheets/css/style.css';
import { useState, useEffect } from 'react';


function App() {
  // const dimension = 3;
  const [dimension, setDimension] = useState(3);
  useEffect(()=>{
    setDimension(dimension);
  }, [dimension]);

  useEffect(()=>{
    const script = document.createElement("script");
    script.src = "scripts/main.js";
    document.body.appendChild(script);
  }, []);

  return (
    <div id="app-container">
      <div className="title-container">
        <h3 className="title-h3">
          Tic-Tac-Toe
        </h3>
      </div>
      <form id="ttt-initiate-form" action="">
        <div className="size-select-container">
          <span className="size_select">Size &nbsp;</span>
          <select name="size" id="size">
            <option value="3">
              3x3
            </option>
            <option value="4">
              4x4
            </option>
            <option value="5">
              5x5
            </option>
            <option value="6">
              6x6
            </option>
            <option value="7">
              7x7
            </option>
            <option value="8">
              8x8
            </option>
          </select>
        </div>
        
        <input type="submit" value="Play!" id="play-button"/>
      </form>
      <br/>
      <br/>
      <TicTacToe
        dimension={dimension}
      />
    </div>
  );
}

export default App;
