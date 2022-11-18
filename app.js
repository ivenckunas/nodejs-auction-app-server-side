const mongoose = require("mongoose")
const express = require("express")
const cors = require("cors")
const app = express()
const mainRouter = require("./router/mainRouter")
const session = require("express-session")
const http = require("http").createServer(app)
const socket = require("socket.io")
require("dotenv").config()

const io = socket(http, {cors: {origin: "http://localhost:3000"}})

mongoose.connect(process.env.MONGO_KEY).then(res => {
    console.log("CONNECTED")
}).catch(e => {
    console.log('ERROR')
})


http.listen(4000)
app.use(express.json())


app.use(cors({
    origin: true, credentials: true, methods: "GET, POST"
}))

app.use(session({
    secret: "6s5d4fs89d4f65", resave: false, saveUninitialized: true
}))

app.use('/', mainRouter)


const users = []
let products = []
const bought = []

io.on("connect", (socket) => {


    socket.emit("products_update", products)


    socket.on("register", username => {
        const user = {
            name: username, id: socket.id, money: 1000
        }

        users.push(user)

        socket.emit("user_update", user)
    })


    socket.on("add_product", prod => {
        const myUser = users.find(x => x.id === socket.id)
        const myProd = {
            ...prod, socket_id: socket.id, id: Date.now(), username: myUser.name
        }

        products.push(myProd)

        io.emit("products_update", products)
    })

    socket.on("buy", id => {
        const boughtItem = products.find(x => x.id === id)
        const me = users.find(x => x.id === socket.id)

        const myIndex = users.findIndex(x => x.id === socket.id)

        const sellerIndex = users.findIndex(x => x.id === boughtItem.socket_id)

        if (boughtItem.price <= me.money) {
            users[myIndex].money -= boughtItem.price
            users[sellerIndex].money += Number(boughtItem.price)

            socket.emit("user_update", users[myIndex])

            io.to(users[sellerIndex].id).emit("user_update", users[sellerIndex])

            boughtItem.owner_id = socket.id
            bought.push(boughtItem)

            products = products.filter(x => x.id !== id)

            const myBoughtItems = bought.filter(x => x.owner_id === socket.id)
            console.log(myBoughtItems)
            socket.emit("bought", myBoughtItems)


            io.emit("products_update", products)
        }



    })
})
