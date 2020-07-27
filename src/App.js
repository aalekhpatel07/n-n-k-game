import React from 'react';
import './stylesheets/css/style.css';
import { useState, useEffect} from 'react';
import { isMobile } from 'react-device-detect';
import {setupGrid, paintBoard} from './artist';


/**
 * Checks if the position at row r and column c is vacant.
 * @param {Number} r - A row of the grid.
 * @param {Number} c - A column of the grid.
 * @param {Array} b - The array of array representation of an n x n board.
 */
function isEmpty(r, c, b){
  return b[r][c] === '_';
}

/**
 * The main App component.
 */
function App() {

  let canvasWidth = 400;
  let canvasHeight = 400;

  if (isMobile){
    canvasWidth = 250;
    canvasHeight = 250;
  }

  // Set the initial state for all the game parameters.
  const [selectedValue, setSelectedValue] = useState(3);
  const [canPlay, setCanPlay] = useState(true);
  const [mValue, setMValue] = useState(selectedValue > 3 ? 4: 3);
  const [conclusion, setConclusion] = useState('A generalization of the Tic-Tac-Toe.');
  const [depth, setDepth] = useState(6);
  let current = createBoard(selectedValue || 3);

  // Set the initial state of the board.
  const [board, setBoard] = useState(current);

  /**
   * Handles the changes in selected the streak value when a user
   * selects a dimension for the grid.
   * @param {SyntheticEvent} e - A React SyntheticEvent wrapped object. 
   */
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

  /**
   * Handles the change in the board object, i.e. any time any change is detected, the board is updated to reflect the new state.
   * @param {Array} board - The array of array representation of an n x n board.
   */
  const handleBoardChange = (board) => {
    setBoard(board);
  };

  /**
   * Handles the consequences of AI winning the game.
   */
  function handleAIWins(){
    setConclusion('AI wins! Better luck next time.');
  }
  
  /**
   * Handles the consequences of a tied game.
   */
  function handleTiedGame(){
    setConclusion('Game Tied! Let\'s play again.');
  }
  
  /**
   * Handles the consequences of a user winning the game.
   */
  function handleUserWin(){
    setConclusion('You win! Congratulations on beating the AI.');
  }

  
  /**
     * Handles the pressing of the reset button.
     * @param {SyntheticEvent} e - A React SyntheticEvent wrapped object.   
     */
  function handleReplay(e){
    e.preventDefault();
    window.location.reload();
  }
  /**
     * Handles the change in the streak when selected by a user.
     * @param {SyntheticEvent} e - A React SyntheticEvent wrapped object.   
     */
  function handleMChange(e){
    setMValue(e.nativeEvent.target.value);
  }

  /**
   * Handles the change in depth of the search when selected by a user.
   * @param {SyntheticEvent} e - A React SyntheticEvent wrapped object.   
   */
  function handleDepthChange(e){
    const temp = e.nativeEvent.target.value;
    setDepth(temp);
  }

  /**
   * Handles the user click on the canvas.
   * @param {SyntheticEvent} e - A React SyntheticEvent wrapped object.   
   */
  function handleClick(e){
    let canvas = document.getElementById('board');
    let dimension = selectedValue;
    let {offsetX, offsetY} = e.nativeEvent;

    // The row of the grid that was clicked.
    let row = Math.floor((offsetY * dimension)/canvas.height);

    // The column of the grid that was clicked.
    let col = Math.floor((offsetX * dimension)/canvas.width);

    if(isEmpty(row, col, board) && canPlay){
        board[row][col] = 'o';
        setCanPlay(false);
        paintBoard(canvas, selectedValue, board);
        // Send an AJAX POST request with the board.
          requestMove()
          .then(res => res.json())
          .then(({row, col, result}) => {
            if(row === -1 || col === -1){
              if(result === 'o'){
                handleUserWin();
                return;
              }else if(result === 'x'){
                handleAIWins();
                return;
              }else if(result === 't'){
                handleTiedGame();
                return;
              }
            }
            board[row][col] = 'x';
            paintBoard(canvas, selectedValue, board);
            
            if(result === 'x'){
              handleAIWins();
            }else if(result === 't'){
              handleTiedGame();
            }else if(result === 'o')
              handleUserWin();
            
            setCanPlay(true);
          })
          .catch(err => console.log(err))
          return;
        }
      } 
    /**
     * Makes a call to the Flask TicTacToe API and
     * retrieves a best move for the AI.
     */
    async function requestMove(){
      if(mValue !== null && mValue !== undefined){
        let URL;
        if(process.env.NODE_ENV === 'development'){
          URL = 'http://192.168.0.17:1337/api/move';
        }else if(process.env.NODE_ENV === 'production'){
          URL = '/api/move'; 
        }else{
          URL = 'http://192.168.0.17:1337/api/move';
        }
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

  // The useEffect calls to update states of some values depending 
  // on the changes in other stateful values.

  useEffect(()=>{
    let canvas = document.getElementById('board');
    setupGrid(selectedValue, canvas);
    let temp = createBoard(selectedValue);
    handleBoardChange(temp);
  }, [selectedValue]);

  useEffect(()=>{
    setCanPlay(true);
  }, [mValue]);

  useEffect(()=>{
    document.getElementById('conclusion').innerText = conclusion;
  }, [conclusion]);

  useEffect(()=>{
    let canvas = document.getElementById('board');
    paintBoard(canvas, selectedValue, board)
  }, [board]);

  // The allowed sizes of the grid.
  const sizes = [3, 4, 5];
  
  // The allowed depths of the search tree.
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
              <dd>The maximum depth of the search tree of positions that is traversed using the <a href="https://www.whitman.edu/documents/Academics/Mathematics/2019/Felstiner-Guichard.pdf"> Minimax algorithm with alpha-beta pruning</a>.</dd>
            </dl>
            <i>Note</i> : &nbsp; The larger the <i>Depth</i>, the longer it will take for the algorithm to find the next best move.<br/> A depth of <strong>6</strong> makes the AI unbeatable for the standard tic-tac-toe game (i.e. <i>the (3, 3, 3)-game</i>). It is also reasonably fast even though it performs roughly less than <i>3 <sup>12</sup> operations. </i> <br/><br/> Similarly, a reasonable depth <strong> &#8805; 6</strong> should make the AI reasonably difficult to play against ( and perhaps unbeatable) for larger board sizes.<br/><br/> In the worst of cases, the Minimax Algorithm runs in <i>O(n<sup> 2d</sup>)</i> &nbsp; but with the alpha-beta pruning employed, in some search trees, not all positions need to be evaluated, therefore cutting the runtime by a significant amount. <br/><br/>
            <i><strong>Tip</strong></i> : For less computation time on larger boards (and consequently an easy difficulty of this AI), set a depth around <strong>3</strong>.
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
                    return x === 3;
                  }else{
                    return x === 4;
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
                    return x === depths;
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
      <footer>
        <span className="copyleft"> &copy;</span>&nbsp;Author: 
        <a href="https://www.aalekhpatel.com">
          <img src={require('./media/ap_logo.svg')} alt="Aalekh Patel" width="30" height="30"/>
        </a>
        &nbsp;Source Code:
        <a href="https://www.github.com/aalekhpatel07/n-n-k-game">
          <img src={require('./media/github-logo_1.png')} alt="Github" width="30" height="30"/>
        </a>
      </footer>
    </div>
  );
}


/**
 * Creates an empty board of size dimension x dimension.
 * @param {Number} dimension 
 */
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
