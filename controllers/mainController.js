const userSchema = require("../schemas/userSchema")
const sendRes = require("../modules/sendRes")
const productSchema = require("../schemas/itemSchema")
const boughtSchema = require("../schemas/boughtProducts")
const bcrypt = require("bcrypt")
const {wordToGuess, makeGuess} = require("../modules/gameLogic")
const e = require("express");


module.exports = {
    register: async (req, res) => {
        const {email, passOne} = req.body

        const password = await bcrypt.hash(passOne, 10)

        const user = new userSchema({
            email,
            password
        })

        await user.save()

        sendRes(res, "registration ok", false)
    },
    login: async (req, res) => {
        const {email, password} = req.body

        const user = await userSchema.findOne({email})

        if(!user) return sendRes(res, "user not found by email", true)

        const compare = await bcrypt.compare(password, user.password)
        console.log(compare)

        if(!compare) return sendRes(res, "bad password", true)

        req.session.user = user

        return sendRes(res, "login is ok", false, {user})
    },
    autoLogin: async (req, res) => {

        if(req.session.user) {
            const {email} = req.session.user
            const user = await userSchema.findOne({email})

            return sendRes(res, "login is ok", false, {user})
        }


        sendRes(res, "no user session", true, null)
    },
    logout: async (req, res) => {
        delete req.session.user
        sendRes(res, "session removed", false, null)
    }

}