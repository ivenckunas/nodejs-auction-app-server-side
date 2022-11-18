const express = require("express");
const router = express.Router();

const { register, login } = require('../controllers/mainController');
const { validateReg } = require("../middleware/validator");


router.post('/register', validateReg, register)
router.post('/login', login)




module.exports = router;