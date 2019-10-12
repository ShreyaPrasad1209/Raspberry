const express = require('express')
const bodyparser = require('body-parser')
const path = require('path')
const router = express.Router();

let app= express();

app.use('/', express.static(path.join(__dirname, 'public')));

app.get('/dashboard', (req, res) => {
    res.send("dashboard");
})
const PORT=5000;

app.listen(PORT,()=>console.log(`Server is running at port ${PORT}`))