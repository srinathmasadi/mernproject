const express = require('express');
const dotenv = require('dotenv');
const userRoute = require('./routes/userRoutes');
const cors = require('cors');
const chatRoute = require('./routes/chatRoute');
const messageRoute = require('./routes/messageRoute');

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


app.listen(PORT, ()=> {
    console.log(`Server started on PORT : ${PORT}` );
})