const express = require('express')
const bodyparser = require('body-parser')
const path = require('path')
const router = express.Router();
let http = require('http');
let fs = require('fs');
let app= express();

router.get('/', (req, res) => {
    res.sendFile(`${__dirname}/static/index.html`);
   });
// route 1-> 
// route2->
let handleRequest = (request, response) => {
    response.writeHead(200, {
        'Content-Type': 'text/html'
    });
    fs.readFile('./index.html', null, function (error, data) {
        if (error) {
            response.writeHead(404);
            respone.write('Whoops! File not found!');
        } else {
            response.write(data);
        }
        response.end();
    });
};


app.use('/', router);
const PORT=5000;

app.listen(PORT,()=>console.log(`Server is running at port ${PORT}`))