const express = require("express")
const cors = require("cors")
const color = require('colors')
const app = express()
const mainRouter = require("./router/mainRouter")
const mongoose = require("mongoose")
require("dotenv").config()

const PORT = process.env.PORT || 5000

mongoose.connect(process.env.MONGO_KEY)
    .then(() => {
        console.log('connected to mongoDB'.bgGreen.bold)
    }).catch((e) => {
        console.log("ERROR", e)
    })

app.listen(PORT, console.log(`server is running on port ${PORT}`.bgYellow.bold))

app.use(cors())
app.use(express.json())

app.use('/', mainRouter)







