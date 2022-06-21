const express = require('express');
const ChatCntrl = require('../controllers/chatController');
const {verifyUser} = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/accesschat',verifyUser,ChatCntrl.accessChat);
router.get('/fetchchat',verifyUser,ChatCntrl.fetchChats);
router.post('/groupchat',verifyUser,ChatCntrl.createGroupChat);
router.put('/renamegroup',verifyUser,ChatCntrl.renameGroup);
router.put('/addtogroup',verifyUser,ChatCntrl.addUser);
router.put('/pulluser',verifyUser,ChatCntrl.removeUser);

module.exports= router;