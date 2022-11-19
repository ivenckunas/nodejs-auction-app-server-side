const express = require("express");
const router = express.Router();

const { register, login, postItem, getAllItems } = require('../controllers/mainController');
const { validateReg } = require("../middleware/validator");


router.post('/register', validateReg, register)
router.post('/login', login)
router.post('/post-item', postItem)
router.get('/all-items', getAllItems)




module.exports = router;