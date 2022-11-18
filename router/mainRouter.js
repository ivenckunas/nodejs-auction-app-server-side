const express = require("express");
const router = express.Router();

const { register, login, postItem, getAllItems } = require('../controllers/mainController');
const { validateReg } = require("../middleware/validator");


router.post('/register', validateReg, register)
router.post('/login', login)
router.post('/postItem', postItem)
router.get('/allItems', getAllItems)




module.exports = router;