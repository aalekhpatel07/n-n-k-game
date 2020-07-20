window.onload = init;


function init(){
    const play_btn = document.getElementById('play-button');
    play_btn.addEventListener('click', (e)=>{
        e.preventDefault();
        let dimension_selector = document.getElementById('size');
        const dimension = dimension_selector.options[dimension_selector.selectedIndex].value;
        setupGrid(dimension);
        handleClicks(dimension);
    });
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

function drawCircle(dimension, row, col){
    let canvas = document.getElementById('board');
    let ctx = canvas.getContext('2d');
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


function drawCross(dimension, row, col){
    let canvas = document.getElementById('board');
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


function handleClicks(dimension){
    let canvas = document.getElementById('board');
    canvas.addEventListener('click', (e) => {
        let row = Math.floor((e.offsetY * dimension)/canvas.height);
        let col = Math.floor((e.offsetX * dimension)/canvas.width);
        console.log(`(${row}, ${col}) selected!`);
        // drawCircle(dimension, row, col);
        // drawCross(dimension, row, col);
    });
}