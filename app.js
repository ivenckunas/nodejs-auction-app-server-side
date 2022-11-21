require("dotenv").config()
const express = require("express")
const cors = require("cors")
const color = require('colors')
const app = express()
const mainRouter = require("./router/mainRouter")
const mongoose = require("mongoose")
const http = require('http').createServer(app);

const PORT = process.env.PORT || 5000

http.listen(PORT, console.log(`server is running on port ${PORT}`.bgYellow.bold));

mongoose.connect(process.env.MONGO_KEY)
    .then(() => {
        console.log('connected to mongoDB'.bgGreen.bold)
    }).catch((e) => {
        console.log("ERROR", e)
    })

app.use(express.json())
app.use(
    cors({
        origin: 'http://localhost:3000',
        credentials: true,
        methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    })
);

app.use(cors())

app.use('/', mainRouter)






