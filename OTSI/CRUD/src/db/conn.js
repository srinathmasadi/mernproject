const mongoose = require("mongoose");

mongoose.connect("mongodb+srv://masadi:masadi@cluster0.d8rfb.mongodb.net/?retryWrites=true&w=majority",{
    
    useNewUrlParser:true,
    useUnifiedTopology:true,
   

}).then(()=>{
    console.log("connection is successful");
}).catch((e)=>{
    console.log(e);
}) 