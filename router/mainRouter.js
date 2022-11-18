const express = require("express")
const router = express.Router()

const {
    register,
    login,
    autoLogin,
    logout
} = require("../controllers/mainController")
const {validateRegister} = require("../modules/validator")

router.post('/register', validateRegister, register)
router.post('/login', login)
router.get("/autologin", autoLogin)
router.get("/logout", logout)


module.exports = router

