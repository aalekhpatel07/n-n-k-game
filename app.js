const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const { exec } = require('child_process');

const app = express();
const PORT = process.env.PORT || 1337;

app.use(cors());

app.use(express.static('public'));
app.use(express.json());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));


function process_using_python(data, res){
    let str = `python3 ./tictactoe.py ${data}`;

    exec(str, (err, stdout, stderr) => {
        let arr = stdout.split(' ');
        if(arr.length === 1){
            // bad case.
            return res.json({
                result: null,
                status: 'invalid',
                row: null,
                col: null
            });
        }

        let r = arr[0];
        let c = arr[1];
        let conclusion = arr[2];
        // console.log(r, c);
        let board = [];
        let dimensions = data.length;
        // console.log(dimensions);

        for(let i = 0; i < dimensions; i++){
            let row = [];
            for(let j = 0; j < dimensions; j++){
                row.push(data[i][j])
            }
            board.push(row);
        }
        board[r][c] = 'x';
        console.log(board);

        if(err){
            console.error(err);
            return res.json({
                error: true,
                details: err,
                row: null,
                col: null,
                result: '-'
            });
        }else{
            return res.json({
                row: r,
                col: c,
                result: conclusion
            });
        }
    });

}


// Routes go here:
app.post('/move', (req, res) => {
    let { board } = req.body;
    console.log('input: ', board);
    // console.log(board);
    process_using_python(board, res);
    // return res.json({blah: 2});
});

app.listen(PORT, ()=>{
    console.log(`Listening on http://localhost:${PORT}`);
});


