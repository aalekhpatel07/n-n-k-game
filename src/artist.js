
/**
 * Draws an empty grid of size dimension x dimension on the given canvas.
 * @param {Number} dimension - The size of the grid.
 * @param {HTMLCanvasElement} canvas - The canvas to be painted. 
 */
export function setupGrid(dimension, canvas){
  let ctx = canvas.getContext('2d');

  // Reset the canvas.
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  ctx.strokeStyle = '#000000';
  ctx.lineWidth = 3;

  if(dimension > 4){
      ctx.lineWidth = Math.min(3, canvas.width/(3*dimension));
  }

  const offset = 1;

  // Draws vertical lines.
  for(let i = 1; i < dimension; i++){
      ctx.beginPath();
      ctx.moveTo((canvas.width/dimension)*i, offset);
      ctx.lineTo((canvas.width/dimension)*i, canvas.height-offset);
      ctx.stroke();
  }

  // Draws horizontal lines.
  for(let i = 1; i < dimension; i++){
      ctx.beginPath();
      ctx.moveTo(offset, (canvas.height/dimension)*i);
      ctx.lineTo(canvas.width-offset, (canvas.height/dimension)*i);
      ctx.stroke();
  }
}

/**
 * Clears a symbol from a box in the canvas.
 * @param {Number} dimension - The size of the canvas.
 * @param {Number} row - A row index within the grid.
 * @param {Number} col - A col index within the grid.
 * @param {HTMLCanvasElement} canvas - The canvas to be painted.
 */
function clearMark(dimension, row, col, canvas){
  let ctx = canvas.getContext('2d');
  let top_left_down = (canvas.height/dimension)*row;
  let top_left_right = (canvas.width/dimension)*col;
  ctx.clearRect(top_left_right + 0.2*(canvas.width/dimension), top_left_down + 0.2*(canvas.height/dimension), 0.6*(canvas.width/dimension), 0.6*(canvas.height/dimension));
}

/**
 * Draws a Circle at index (row, col) in the grid.
 * @param {Number} dimension - The size of the canvas.
 * @param {Number} row - A row index within the grid.
 * @param {Number} col - A col index within the grid.
 * @param {HTMLCanvasElement} canvas - The canvas to be painted.
 */
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

/**
 * Draws a Cross at index (row, col) in the grid.
 * @param {Number} dimension - The size of the canvas.
 * @param {Number} row - A row index within the grid.
 * @param {Number} col - A col index within the grid.
 * @param {HTMLCanvasElement} canvas - The canvas to be painted.
 */
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

/**
 * Draws a board onto a canvas.
 * @param {HTMLCanvasElement} canvas - The canvas to be painted. 
 * @param {Number} selectedValue - The current dimension of the board. 
 * @param {Array} board - The array of array representation of the grid. 
 */
export function paintBoard(canvas, selectedValue, board){
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
}