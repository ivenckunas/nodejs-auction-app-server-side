const express = require("express");
const router = express.Router();

const { register, login, postItem, getAllItems, updateBid } = require('../controllers/mainController');
const { validateReg } = require("../middleware/validator");


router.post('/register', validateReg, register)
router.post('/login', login)
router.post('/post-item', postItem)
router.get('/all-items', getAllItems)
router.post('/update', updateBid)


module.exports = router;