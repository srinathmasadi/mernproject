
const mongoose = require('mongoose');
const uri = process.env.MONGO_URI
mongoose.connect("mongodb+srv://masadi:masadi@cluster0.d8rfb.mongodb.net/?retryWrites=true&w=majority", {
    useNewUrlParser:true,
    useUnifiedTopology:true,
}).then(()=> {
    console.log("Database connected Successfully")
}). catch((e)=> {
    console.log("Error in connecting database",e);
})
