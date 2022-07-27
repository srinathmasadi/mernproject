const express = require('express');
const dotenv = require('dotenv');
const userRoute = require('./routes/userRoutes');
const cors = require('cors');
const chatRoute = require('./routes/chatRoute');
const messageRoute = require('./routes/messageRoute');
const path = require('path')

require('./config/db');
dotenv.config();

const app = express();
app.use(cors());
app.options('*', cors());
app.use(express.json());

const PORT = process.env.PORT;

app.use("/user",userRoute);
app.use("/chat",chatRoute);
app.use("/message",messageRoute);

// ---------------------Deployment-------------------

const __dirname1 =path.resolve();
if(process.env.NODE_ENV==='production'){
    app.use(express.static(path.join(__dirname1,'chat-frontend/build')));
    app.get('*',(req,res)=>{
        res.sendFile(path.resolve(__dirname1,"chat-frontend","build","index.html"));
    })
} else{
    app.get("/",(req,res)=>{
        res.send("Api is Running Successfully");
    })
}

// ---------------------Deployment-------------------

const server = app.listen(PORT, ()=> {
    console.log(`Server started on PORT : ${PORT}` );
});

const io = require('socket.io')(server,{
    pingTimeout:60000,
    cors:{
        origin:"http://localhost:3000",
    },
});

io.on("connection",(socket)=>{
    console.log("Connected to socket.io");

    socket.on('setup',(userData)=>{
        socket.join(userData._id);
        socket.emit('connected');
    });

    socket.on('join chat',(room)=>{
        socket.join(room);
        console.log("User Joined Room:",room);
    });

    socket.on('typing',(room)=>socket.in(room).emit("typing"));
    socket.on('stop typing',(room)=>socket.in(room).emit("stop typing"));

    socket.on('new message',(newMessageRecieved)=>{
        var chat = newMessageRecieved.chat;
        if(!chat.users) return console.log('chat.users not defined');

        chat.users.forEach(user=>{
            if(user._id==newMessageRecieved.sender._id) return;
            socket.in(user._id).emit("message recieved", newMessageRecieved);
        })
    });

    socket.off('setup', ()=>{
        console.log("User disconnected");
        socket.leave(userData._id);
    });
});