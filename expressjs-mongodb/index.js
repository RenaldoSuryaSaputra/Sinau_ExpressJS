const express = require('express');
const path = require('path');
const mongoose = require('mongoose');


// Connect to mongoDB
mongoose.connect('mongodb://127.0.0.1/shop_db').then((result) => {
    console.log("connected to mongodb")
}).catch((error) => {
    console.log(error)
})

const app = express()

app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'ejs')

app.get('/', (req, res) => {
    res.send("Helo World das")
})

app.listen(3000, () =>{
    console.log("Port Listening on http://127.0.0.1:3000 !")
})
