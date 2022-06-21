const { Error } = require('mongoose');
const Chat = require('../models/chatModel');
const User = require('../models/userModel');

exports.accessChat = async(req,res)=> {

    try {
        const { userId } = req.body;
        if (!userId) {
            console.log("UserId param not sent with request");
            return res.sendStatus(400);
          }
        
          var isChat = await Chat.find({
            isGroupChat: false,
            $and: [
              { users: { $elemMatch: { $eq: req.user._id } } },
              { users: { $elemMatch: { $eq: userId } } },
            ],
          })
            .populate("users", "-password")
            .populate("latestMessage");
        
          isChat = await User.populate(isChat, {
            path: "latestMessage.sender",
            select: "name pic email",
          });
        
          if (isChat.length > 0) {
            res.send(isChat[0]);
          } else {
            var chatData = {
              chatName: "sender",
              isGroupChat: false,
              users: [req.user._id, userId],
            };
        
            try {
              const createdChat = await Chat.create(chatData);
              const FullChat = await Chat.findOne({ _id: createdChat._id }).populate(
                "users",
                "-password"
              );
              res.status(200).json(FullChat);
            } catch (error) {
              res.status(400);
              throw new Error(error.message);
            }
          }
    } catch (error) {
        res.send("Something went Wrong",error);
        console,log(error)
    }
   
}

exports.fetchChats = async(req,res)=>{
    try {
       await Chat.find({users:{$elemMatch:{$eq:req.user._id}}})
       .populate("users","-password")
       .populate("groupAdmin","-password")
       .populate("latestMessage")
       .sort({updatedAt:-1})
       .then(async (results)=>{
            results = await User.populate(results,{
                path:"latestMessage.sender",
                select:"name pic email",
            })
            res.status(200).send(results);
       })
    } catch (error) {
        res.status(400);
        throw new Error(error.message);
    }
}

exports.createGroupChat = async(req,res)=>{
    try {
        if(!req.body.users || !req.body.name) {
            return res.status(400).send({message:"Please fill all the fields"});
        }

        var users = JSON.parse(req.body.users);

        if(users.length<2) {
            return res
            .status(400)
            .send({message:"Atleast select 2 users to create group"});
        }
        users.push(req.user); //push the group users along the logged in user

        try {
            const groupChat = await Chat.create({
                chatName:req.body.name,
                users:users,
                isGroupChat:true,
                groupAdmin:req.user,
            });

            const fullGroupChat = await Chat.findOne({_id:groupChat._id})
                .populate("users","-password")
                .populate("groupAdmin","-password")
            res.status(200).json(fullGroupChat)

        } catch (error) {
            res.status(400);
            throw new Error(error.message);
        }
    } catch (error) {
        res.status(400);
        throw new Error(error.message);
    }
}

exports.renameGroup = async(req,res)=>{
    try {
        const {chatId, chatName}= req.body;

    const updatedChat = await Chat.findByIdAndUpdate(
        chatId,
        {
            chatName
        },{
            new:true,
        }
    )
    .populate("users","-password")
    .populate("groupAdmin","-password");

    if(!updatedChat) {
        res.status(404);
        throw new Error("Chat Not Found")
    } else{
        res.json(updatedChat);
    }
    } catch (error) {
        res.status(404);
        throw new Error(error.message);
    }
    
}

exports.addUser = async(req,res)=>{
    try {
        const {chatId,userId} = req.body;

        const added = await Chat.findByIdAndUpdate(
            chatId,
            {
                $push:{users:userId},
                
            },
            {
                new:true
            }
        )
        .populate("users","-password")
        .populate("groupAdmin","-password");

        if(!added) {
            res.status(404);
            throw new Error("Chat Not Found")
        } else{
            res.json(added);
        }
        
    } catch (error) {
        res.status(404);
        throw new Error(error.message);
    }
}

exports.removeUser = async(req,res)=>{
    try {
        const {chatId,userId} = req.body;

        const removed = await Chat.findByIdAndUpdate(
            chatId,
            {
                $pull:{users:userId},
                
            },
            {
                new:true
            }
        )
        .populate("users","-password")
        .populate("groupAdmin","-password");

        if(!removed) {
            res.status(404);
            throw new Error("Chat Not Found")
        } else{
            res.json(removed);
        }
        
    } catch (error) {
        res.status(404);
        throw new Error(error.message);
    }
}