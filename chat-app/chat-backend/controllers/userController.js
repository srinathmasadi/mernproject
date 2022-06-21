const User=require('../models/userModel')
const bcrypt = require('bcrypt');
const generateToken = require('../config/generateToken')

exports.addUser = async(req, res) => {
    try {
        const {name, email, password,pic} = req.body;
        if(name!=="" && email!=="" && password!=="" ) {
            const userExist = await User.findOne({email:email})   
            if(userExist){
                res.status(400).json({message:"User already exists"})
            } else{
                    const data = new User({name,email,password,pic})
                    const response = await data.save();
                    res.status(200).json({
                        message:"User Saved Successfully",
                        _id:response.id,
                        name:response.name,
                        email:response.email,
                        token:generateToken(response._id)
                }) 
            }      
        } else{
            res.status(400).json({message:"Please fill all the required fields"})
        }     
    }catch (error) {
        res.status(400).json({message:"error in creating user"});
        console.log(error)
    }
}

exports.logInUser = async(req,res)=> {
    try{
       const {email,password}= req.body
       if(email!=="" && password!=="") {
        const userLogin = await User.findOne({email});
        const isMatch = await bcrypt.compare(password, userLogin.password);
        if(isMatch) {
            
            res.json({
                message:"User Logged in successfully",
                _id:userLogin._id,
                name:userLogin.name,
                email:userLogin.email,
                token:generateToken(userLogin._id)
            })
            
        }else{
            res.status(400).json({message:"Invalid Credentials"});
        }
        
       } else{
        res.status(400).json({message:"Please fill all the required fields"});
       }   

    }catch(e){

        res.status(400).json({message:"Something went wrong",data:e});
        console.log(e)
    }
}

exports.allUsers = async(req, res)=>{
    const keyword = req.query.search?{
        $or:[
            {name:{$regex:req.query.search, $options:'i'}},
            {email:{$regex:req.query.search, $options:'i'}}
        ],
    }
    :
    {};
    const users = await User.find(keyword).find({_id:{$ne:req.user._id}});
    res.send(users);
}