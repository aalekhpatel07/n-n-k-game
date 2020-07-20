import React from 'react';


const TicTacToe = ({dimension}) => {

    const canvasWidth = 400;
    const canvasHeight = 400;

    return (
        <div id="tic_tac_toe_board">
            <canvas id="board" height={canvasHeight} width={canvasWidth}>
            </canvas>
        </div>
    );
};


export default TicTacToe;