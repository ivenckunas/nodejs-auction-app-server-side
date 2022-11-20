const userSchema = require('../schemas/userSchema');
const bcrypt = require('bcrypt');
const { uid } = require('uid');
const itemSchema = require('../schemas/itemSchema');
const { MongoClient } = require('mongodb');
const { db } = require('../schemas/userSchema');

const URI = "mongodb+srv://admin:admin@cluster1.3gshm1s.mongodb.net/?retryWrites=true&w=majority"

const client = new MongoClient(URI);


module.exports = {
    register: async (req, res) => {
        const { email, password } = req.body;
        const userExists = await userSchema.findOne({ email });
        console.log('userExists ===', userExists);
        if (userExists) {
            res.send({ error: true, message: 'user already exists', data: null });
            return
        }

        // JEIGU NERASTAS USERIS, REGISTRUOJAM NAUJA

        const hashedPsw = await bcrypt.hash(password, 10)
        const secret = uid(30);
        const newUser = new userSchema({ email, hashedPsw, secret });
        await newUser.save();


        res.send({ error: false, message: 'registered successfully', data: newUser })
    },

    login: async (req, res) => {
        const { email, password } = req.body;

        const userExists = await userSchema.findOne({ email, password });
        if (!userExists) return res.send({ error: true, message: 'user does not exist. Please register first', data: null });

        const comparedPsw = await bcrypt.compare(password, userExists.hashedPsw)
        if (!comparedPsw) return res.send({ error: true, message: 'wrong credentials', data: null });

        res.send({ error: false, message: 'successfully logged in', data: { email: userExists.email, secret: userExists.secret, photo: userExists.photo } })

    },

    postItem: async (req, res) => {
        const { image, title, date, price, bid } = req.body

        const newItem = new itemSchema({ image, title, date, price, bid });
        await newItem.save();


        res.send({ error: false, message: 'item uploaded successfully', data: newItem })
    },

    getAllItems: async (req, res) => {
        const con = await client.connect();
        const data = await con.db("test").collection("type12items-atsiskaitymas").find().toArray();
        return res.send(data);
    },

    updateBid: async (req, res) => {
        const itemId = req.body.itemId._id
        const bid = req.body.bid
        const item = await itemSchema.findOneAndUpdate({ _id: itemId }, { bid: bid });

        res.send(item)

    }
}