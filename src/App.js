import React from 'react';
import './stylesheets/css/style.css';
import { useState, useEffect} from 'react';
import {isMobile} from 'react-device-detect';


function isEqual(arr1, arr2){
  if(arr1.length !== arr2.length)return false;
  for(let i = 0; i < arr1.length; i++){
    if(arr1[i] !== arr2[i])return false;
  };
  return true;
}

function hasWon(b, player){
  let target = [];
  for(let i = 0; i < b.length; i++){
    target.push(player);
  }

  for(let i = 0; i < b.length; i++){
    if(isEqual(b[i], target)){
      return true;
    }
  }

  for(let i = 0; i < b.length; i++){
    let column = [];
    for(let j = 0; j < b.length; j++){
      column.push(b[j][i]);
    }
    if(isEqual(column, target)){
      return true;
    }
  }

  let diagonal = [];
  for(let i = 0; i < b.length; i++){
    diagonal.push(b[i][i]);
  }
  if(isEqual(diagonal, target)){
    return true;
  }

  let antidiagonal = [];
  for(let i = 0; i < b.length; i++){
    antidiagonal.push(b[i][b.length-i-1]);
  }
  if(isEqual(antidiagonal, target)){
    return true;
  }
  return false;
}

function hasOWon(b){
  return hasWon(b, 'o');
}

function hasXWon(b){
  return hasWon(b, 'x');
}

function countEmpty(b){

  let count = 0;
  for(let r = 0; r < b.length; r++){
    for(let c = 0; c < b[r].length; c++){
      if(b[r][c] === '_'){
        count++;
      }
    }
  }
  return count;
}

function hasGameTied(b){
  return !hasOWon(b) && !hasXWon(b) && (countEmpty(b) === 0);
}

function isEmpty(row, col, b){
  return b[row][col] === '_';
}


function App() {

  let canvasWidth = 400;
  let canvasHeight = 400;

  if (isMobile){
    canvasWidth = 250;
    canvasHeight = 250;
  }
  // for smaller screens, i.e. phone.
  // const canvasWidth = 250;
  // const canvasHeight = 250;


  const [selectedValue, setSelectedValue] = useState(3);
  const [canPlay, setCanPlay] = useState(true);
  const [mValue, setMValue] = useState(selectedValue > 3 ? 4: 3);

  // const [gameStatus, setGameStatus] = useState(false);
  const [conclusion, setConclusion] = useState('Because Tic-Tac-Toe is solved.');
  const [depth, setDepth] = useState(6);


  let current = createBoard(selectedValue || 3);

  const [board, setBoard] = useState(current);

  const handleChange = (e) =>{
    const temp = e.nativeEvent.target.value;
    setSelectedValue(temp ? temp: 3);
    if(temp === 3){
      setMValue(3);
      setCanPlay(false);
    }else{
      setMValue(4);
      setCanPlay(false);
    }
  };

  const handleBoardChange = (board) => {
    setBoard(board);
  };

  function handleAIWins(){
    setConclusion('AI wins! Better luck next time.');
  }
  
  function handleTiedGame(){
    setConclusion('Game Tied! Let\'s play again.');
  }
  
  function handleUserWin(){
    setConclusion('You win! Congratulations on beating the AI (the minimax algorithm with alpha-beta pruning).');
  }


  function paintBoard(){
    let canvas = document.getElementById('board');
    let dimension = selectedValue;
    if(board === undefined || !board){
      return;
    }

    for(let r = 0; r < dimension; r++){
      for(let c = 0; c < dimension; c++){

        if(board[r][c] === 'x'){
          drawCross(dimension, r, c, canvas);
        }else if(board[r][c] === 'o'){
          drawCircle(dimension, r, c, canvas);
        }else{
          clearMark(dimension, r, c, canvas);
        }
      }
    }
    return;
  }

  async function requestMove(){
    if(mValue !== null && mValue !== undefined){
      const PORT = 5000;
      const URL = `http://192.168.0.17:${PORT}/move`
      const response = await fetch(URL, {
          method: 'POST',
          headers: {
              'Content-Type': 'application/json'
          },
          body: JSON.stringify({board: board, streak: mValue, depth: depth})
      });
      return response;
    }
  }

  function handleReplay(e){
    e.preventDefault();
    window.location.reload();
  }

  function handleMChange(e){
    // setMaxMValue(selectedValue ? selectedValue : 3);
    setMValue(e.nativeEvent.target.value);
  }

  function handleDepthChange(e){
    const temp = e.nativeEvent.target.value;
    setDepth(temp);
  }


  function handleClick(e){
    let canvas = document.getElementById('board');
    let dimension = selectedValue;
    let {offsetX, offsetY} = e.nativeEvent;

    let row = Math.floor((offsetY * dimension)/canvas.height);
    let col = Math.floor((offsetX * dimension)/canvas.width);

    if(isEmpty(row, col, board) && canPlay){
        board[row][col] = 'o';
        setCanPlay(false);
        paintBoard();
        if(hasOWon(board)){
          // setGameStatus(true);
          handleUserWin();
          return;
        }else if(hasGameTied(board)){
          // setGameStatus(true);
          handleTiedGame();
          return;
        }else if(hasXWon(board)){
          // setGameStatus(true);
          handleAIWins();
          return;
        }else{
          // Send an AJAX POST request with the board.
          
          requestMove()
          .then(res => res.json())
          .then(({row, col, result}) => {
            if(row === -1 || col === -1){
              if(result === 'o'){
                // setGameStatus(true);
                handleUserWin();
                return;
              }else if(result === 'x'){
                // setGameStatus(true);
                handleAIWins();
                return;
              }
            }
            board[row][col] = 'x';
            paintBoard();
            
            if(result === 'x'){
              handleAIWins();
              // setGameStatus(true);
            }else if(result === 't'){
              handleTiedGame();
              // setGameStatus(true);
            }else if(result === 'o')
              // setGameStatus(true);
              handleUserWin();
            
            setCanPlay(true);
          })
          .catch(err => console.log(err))
          return;
        }
      } 
    }

  useEffect(()=>{
    setupGrid(selectedValue);
    let temp = createBoard(selectedValue);
    handleBoardChange(temp);
  }, [selectedValue]);

  useEffect(()=>{
    setCanPlay(true);
  }, [mValue]);

  useEffect(()=>{
    document.getElementById('conclusion').innerText = conclusion;
  }, [conclusion]);

  useEffect(paintBoard, [board]);

  const sizes = [3, 4, 5];
  const depths = [2, 3, 4, 5, 6, 7, 8, 9, 10];

  return (
    <div id="app-container">
      <div className="title-container">
        <h3 className="title-h3" >
          The (n, n, k)-game
        </h3>
        <span id="conclusion" className="conclusion">
          {conclusion}
        </span>
      </div>
      <div className="rest-of-app">
        <div className="settings-panel">
          <div className="info-box">
            <span className="instructions-title"> <u> Instructions and Settings </u></span>
            <dl className="definitions">
              <dt>Size</dt>
              <dd>The size of the square board, i.e. <i>n x n</i>. For example <i>3 x 3</i>.</dd>
              <dt>Streak</dt>
              <dd>The number of consecutive symbols needed to win, i.e. k. For example <i>3</i>.</dd>
              <dt>Depth</dt>
              <dd>The maximum depth of the search tree of positions that is traversed using the Minimax algorithm with alpha-beta pruning.</dd>
            </dl>
            <i>Note</i> : &nbsp; The larger the <i>Depth</i>, the longer it will take for the algorithm to find the next best move.<br/> A depth of <strong>6</strong> makes the AI unbeatable for the standard tic-tac-toe game (i.e. <i>the (3, 3, 3)-game</i>). It is also reasonably fast even though it performs roughly less than <i>3 <sup>12</sup> operations. </i> <br/><br/> Similarly, a reasonable depth <strong> &#8805; 4</strong> should make the AI reasonably difficult to play against ( and perhaps unbeatable) for larger board sizes.<br/><br/> In the worst of cases, the Minimax Algorithm runs in <i>O(n<sup> 2d</sup>)</i> &nbsp; but with the alpha-beta pruning employed, in some search trees, not all positions need to be evaluated, therefore cutting the runtime by a significant amount. <br/><br/>
            <i><strong>Tip</strong></i> : For less computation time on larger boards (and consequently an easy difficulty of this AI), set a depth of at most 2.
          </div>
        <form id="ttt-initiate-form" action="">
          <div className="size-select-container">
            <label htmlFor="size-select">Size</label>
            <div>
              {sizes.map((x) => (
                <label
                key={`dimension-label-radio-input-${x}`}>
                <input
                  type="radio"
                  name="dimension"
                  key={`dimension-radio-input-${x}`}
                  id={`dimension-radio-input-${x}`}
                  className="dimension-radio-input"
                  value={x}
                  onChange={handleChange}
                  defaultChecked={x === 3 ? true: false}
                />
                {x}
                </label>
              ))}
            </div>
            <br/>
            <label>Streak length</label>
            <div>
            {
            function(){
            let temp = [];
            if(selectedValue <= 3){
              temp.push(3);
            }else{
              for(let i = 4; i <= selectedValue; i++){
                temp.push(i);
              }
            }
            return temp.map((x) => (
              <label
              key={`streak-label-radio-input-${x}`}>
              <input
                type="radio"
                name="streak"
                key={`streak-radio-input-${x}`}
                id={`streak-radio-input-${x}`}
                className="streak-radio-input"
                value={x}
                onChange={handleMChange}
                defaultChecked={function(){
                  if(selectedValue === 3){
                    return x === 3 ? true: false;
                  }else{
                    return x === 4 ? true: false;
                  }
                }()}
              />
              {x}
              </label>
            ))}()}
            </div>
            <br/>
            <label htmlFor="">Search Depth</label>
            <div>
              {depths.map((x) => (
                <label
                key={`depth-label-radio-input-${x}`}>
                <input
                  type="radio"
                  name="depths"
                  key={`depths-radio-input-${x}`}
                  id={`depths-radio-input-${x}`}
                  className="streak-radio-input"
                  value={x}
                  onChange={handleDepthChange}
                  defaultChecked={function(){
                    return x === depth ? true: false;
                  }()}
                />
              {x}
              </label>
              )
            )}
            
            
            </div>
          </div>
          <input id="replay-button" type="button" value="Reset!" onClick={handleReplay}/>
        </form>
        </div>
        <div id="tic_tac_toe_board">
          <canvas id="board"
          height={canvasHeight}
          width={canvasWidth}
          onClick={handleClick}
          >
          </canvas>
        </div>
      </div>
    </div>
  );
}


function setupGrid(dimension){
  let canvas = document.getElementById('board');
  let ctx = canvas.getContext('2d');

  // Reset the canvas.
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  ctx.strokeStyle = '#000000';
  ctx.lineWidth = 3;

  if(dimension > 4){
      ctx.lineWidth = Math.min(3, canvas.width/(3*dimension));
  }

  const offset = 1;

  // Draw vertical lines.
  for(let i = 1; i < dimension; i++){
      ctx.beginPath();
      ctx.moveTo((canvas.width/dimension)*i, offset);
      ctx.lineTo((canvas.width/dimension)*i, canvas.height-offset);
      ctx.stroke();
  }

  // Draw horizontal lines.
  for(let i = 1; i < dimension; i++){
      ctx.beginPath();
      ctx.moveTo(offset, (canvas.height/dimension)*i);
      ctx.lineTo(canvas.width-offset, (canvas.height/dimension)*i);
      ctx.stroke();
  }
}

function clearMark(dimension, row, col, canvas){
  let ctx = canvas.getContext('2d');

  let top_left_down = (canvas.height/dimension)*row;
  let top_left_right = (canvas.width/dimension)*col;
  ctx.clearRect(top_left_right + 0.2*(canvas.width/dimension), top_left_down + 0.2*(canvas.height/dimension), 0.6*(canvas.width/dimension), 0.6*(canvas.height/dimension));
}

function drawCircle(dimension, row, col, canvas){
  let ctx = canvas.getContext('2d');
  ctx.webkitImageSmoothingEnabled=true;
  let diameter = (canvas.width/dimension);
  
  const center_x = (canvas.width/dimension)*col + diameter/2;
  const center_y = (canvas.height/dimension)*row + diameter/2;


  ctx.strokeStyle = '#000000';
  ctx.lineWidth = 3;

  ctx.beginPath();
  ctx.arc(center_x, center_y, diameter/4, 0, 2* Math.PI);
  ctx.stroke();
  return
}


function drawCross(dimension, row, col, canvas){

  let ctx = canvas.getContext('2d');
  const width = (canvas.width/dimension);
  const height = (canvas.height/dimension);

  const center_x = (canvas.width/dimension) * col + width/2;
  const center_y = (canvas.height/dimension) * row + height/2;

  ctx.beginPath();
  ctx.moveTo(center_x - 0.25 * (canvas.width/dimension), center_y - 0.25 * (canvas.height/dimension));
  ctx.lineTo(center_x + 0.25 * (canvas.width/dimension), center_y + 0.25*(canvas.height/dimension));
  ctx.stroke();

  ctx.beginPath();
  ctx.moveTo(center_x - 0.25*(canvas.width/dimension), center_y + 0.25*(canvas.height/dimension));
  ctx.lineTo(center_x + 0.25*(canvas.width/dimension), center_y - 0.25*(canvas.height/dimension));
  ctx.stroke();
}

function createBoard(dimension){
  let empty_board = [];
  for(let i = 0; i < dimension; i++){
      let empty_row = [];
      for(let j = 0; j < dimension; j++){
          empty_row.push('_');
      }
      empty_board.push(empty_row);
  }
  return empty_board;
}


export default App;
