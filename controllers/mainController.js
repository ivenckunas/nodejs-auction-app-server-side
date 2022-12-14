const userSchema = require('../schemas/userSchema');
const bcrypt = require('bcrypt');
const { uid } = require('uid');
const itemSchema = require('../schemas/itemSchema');
const { MongoClient } = require('mongodb');

const client = new MongoClient(process.env.MONGO_KEY);

module.exports = {
    register: async (req, res) => {
        const { email, password } = req.body;
        const userExists = await userSchema.findOne({ email });
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
        const { image, title, date, price, bid, bidder, bidHistory } = req.body
        const newItem = new itemSchema({ image, title, date, price, bid, bidder, bidHistory });
        await newItem.save();
        res.send({ error: false, message: 'item uploaded successfully', data: newItem })
    },

    getAllItems: async (req, res) => {
        const con = await client.connect();
        const data = await con.db("test").collection("type12items-atsiskaitymas").find().toArray();
        res.send({ error: false, message: 'all items downloaded successfully', data: data })

    },

    updateBid: async (req, res) => {
        const itemId = req.body.itemId._id
        const bid = req.body.bid
        const bidder = req.body.bidder
        const item = await itemSchema.findOneAndUpdate({ _id: itemId }, { bid: bid, bidder: bidder });
        res.send({ error: false, message: 'all items downloaded successfully', data: item })
    },

    updateBidHistory: async (req, res) => {
        const itemId = req.body.itemId._id
        const updatedBidHistory = await itemSchema.findOneAndUpdate({ _id: itemId }, { $push: { bidHistory: { bid: req.body.bid, bidder: req.body.bidder } } });
        res.send({ error: false, message: 'bid history updaded', data: updatedBidHistory })
    },
}
