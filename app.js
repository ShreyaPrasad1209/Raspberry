const express = require('express')
const bodyparser = require('body-parser')

let app= express();

app.get('/', (req,res) => res.send('Homepage!'))

const PORT=5000;

app.listen(PORT,()=>console.log(`Server is running at port ${PORT}`))