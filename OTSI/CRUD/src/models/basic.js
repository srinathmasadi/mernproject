const mongoose = require("mongoose");


const basicSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
       
    },
        email:{
            type:String,
            required:true,
        },
        phone:{
            type: Number,
            required:true,
        },
        address:{
            type: String,
            required:true
        }
})

const Student = new mongoose.model('Student', basicSchema);

module.exports= Student;