const userCntrl = require('../controllers/userController')
const express = require('express');
const {verifyUser} = require('../middleware/authMiddleware')

const router = express.Router();

router.post('/register',userCntrl.addUser);
router.post('/login',userCntrl.logInUser);
router.get('/getallusers/',verifyUser,userCntrl.allUsers);
module.exports= router;