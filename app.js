const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.static('public'));
app.use(express.json());


app.get('/', (req, res) => {
    return res.end('2');
});

app.listen(PORT, ()=>{
    console.log(`Listening on http://localhost:${PORT}`);
});
