const messageCntrl = require('../controllers/messageController')
const express = require('express');
const {verifyUser} = require('../middleware/authMiddleware')

const router = express.Router();

router.post('/send',verifyUser,messageCntrl.sendMessage);
router.get('/allmessages/:chatId',verifyUser,messageCntrl.allMessages);

module.exports= router;